# 🪶 Simple Hedera Messaging Service

A simple **Node.js** project that demonstrates how to use the **Hedera Consensus Service (HCS)** for encrypted message publishing and querying.
Messages are **AES-256-CBC encrypted**, sent to a Hedera topic, and then decrypted upon retrieval.

---

## 🚀 Features

* Create a new **Hedera Topic** automatically
* **Encrypt** and **decrypt** messages using AES-256-CBC
* Send encrypted messages to Hedera Consensus Service
* **Subscribe** and **receive** real-time messages
* Filter received messages based on keywords

---

## 🧰 Tech Stack

* **Node.js**
* **Hedera JavaScript SDK (@hashgraph/sdk)**
* **dotenv** (for environment variables)
* **crypto** (for AES encryption)

---

## 📦 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

### 2️⃣ Install dependencies

```bash
npm install @hashgraph/sdk dotenv
```

---

## ⚙️ Configuration

Create a `.env` file in the project root and add your **Hedera Testnet credentials**:

```env
ACCOUNT_ID=ur_account_id
PRIVATE_KEY=ur_private_id

> ⚠️ **Never share your private key publicly.**
> Use a `.gitignore` file to exclude `.env` from GitHub.

---

## ▶️ Running the Project

To start the app:

```bash
node index.js
```

You’ll see logs like:

```
✅ Topic ID: 0.0.xxxxxxx
📤 Sent: Hello, Hedera!
📥 Received: Hello, Hedera!
🔍 Filtered Messages: [ 'Hello, Hedera!' ]
```


## 🧩 Example Output

```
✅ Topic ID: 0.0.7382123
📤 Sent: Hello, Hedera!
📥 Received: Hello, Hedera!
📥 Received: Learning HCS
📥 Received: Message 3
🔍 Filtered Messages: [ 'Hello, Hedera!' ]
```



---

### 💡 Credits

Built with ❤️ using [Hedera Hashgraph SDK](https://hedera.com) and Node.js.
