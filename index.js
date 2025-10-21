// Load environment variables
require("dotenv").config();
const {
  Client,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicMessageQuery,
} = require("@hashgraph/sdk");
const crypto = require("crypto");

// ✅ Fixed encryption key and IV
const secretKey = crypto.createHash("sha256").update("my-secret-key").digest(); // 32 bytes
const iv = Buffer.alloc(16, 0); // 16 bytes of zeros

function encryptMessage(message) {
  const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decryptMessage(encryptedMessage) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", secretKey, iv);
  let decrypted = decipher.update(encryptedMessage, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// ✅ Initialize Hedera client
const accountId = process.env.ACCOUNT_ID;
const privateKeyStr = process.env.PRIVATE_KEY;

if (!accountId || !privateKeyStr) {
  throw new Error("Missing ACCOUNT_ID or PRIVATE_KEY in .env file");
}

const operatorKey = PrivateKey.fromString(privateKeyStr);
const client = Client.forTestnet();
client.setOperator(accountId, operatorKey);

async function createTopic() {
  const tx = await new TopicCreateTransaction().execute(client);
  const receipt = await tx.getReceipt(client);
  console.log("✅ Topic ID:", receipt.topicId.toString());
  return receipt.topicId;
}

async function sendMessage(topicId, message) {
  const encrypted = encryptMessage(message);
  await new TopicMessageSubmitTransaction()
    .setTopicId(topicId)
    .setMessage(encrypted)
    .execute(client);
  console.log("📤 Sent:", message);
}

function filterMessages(messages, keyword) {
  return messages.filter((msg) => msg.includes(keyword));
}

async function receiveMessages(topicId) {
  const messages = [];

  new TopicMessageQuery()
    .setTopicId(topicId)
    .subscribe(client, null, (msg) => {
      const encrypted = Buffer.from(msg.contents).toString("utf8");
      try {
        const decrypted = decryptMessage(encrypted);
        messages.push(decrypted);
        console.log("📥 Received:", decrypted);
      } catch (err) {
        console.log("⚠ Decryption failed:", err.message);
      }
    });

  // Wait to collect messages
  await new Promise((r) => setTimeout(r, 5000));

  const filtered = filterMessages(messages, "Hedera");
  console.log("🔍 Filtered Messages:", filtered);
}

(async () => {
  const topicId = await createTopic();

  // ✅ Subscribe after topic is created
  setTimeout(async () => {
    await receiveMessages(topicId);
  }, 7000);

  // ✅ Send messages after subscription starts
  setTimeout(async () => {
    await sendMessage(topicId, "Hello, Hedera!");
    await sendMessage(topicId, "Learning HCS");
    await sendMessage(topicId, "Message 3");
  }, 8000);
})();