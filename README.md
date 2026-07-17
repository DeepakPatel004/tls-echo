# 🔐 TLS Echo Server (Node.js)

A beginner-friendly **TLS Echo Server** built using Node.js' native **`tls`** module to understand how **secure TCP communication** works under the hood.

Unlike an HTTPS server built with Express, this project communicates directly over **TLS**, making it easier to understand how certificates, the TLS handshake, and encrypted sockets work internally.

> 📖 **Want to understand the protocol in depth?**
> Read **[`TLS_EXPLAINED.md`](TLS_EXPLAINED.md)** for a complete explanation of the TLS handshake, Diffie-Hellman, RSA certificates, certificate authorities, and Man-in-the-Middle attack scenarios.

---

# 📌 Project Overview

The objective of this project was **not simply to build an echo server**, but to understand **how TLS establishes a secure connection** before any application data is exchanged.

While building this project, I explored:

* How TLS sits on top of TCP
* How a TLS handshake works
* Why certificates are required
* How Node.js uses OpenSSL internally
* How encrypted communication happens without manually encrypting messages

---

# 🏗️ Architecture

```text
                Encrypted Communication

+-------------+    TLS over TCP    +-------------+
|   Client    | <--------------->  |   Server    |
+-------------+                    +-------------+
        │                                 │
        └────────────── TCP ──────────────┘
```

Unlike a normal TCP socket, both sides complete the **TLS handshake** before exchanging application data.

---

# ✨ Features

* Built using Node.js' native `tls` module
* Secure client-server communication
* Self-signed RSA certificate
* Automatic TLS handshake
* Encrypted socket communication
* Simple Echo Server implementation
* Beginner-friendly code with explanations

---

# 🛠️ Tech Stack

* Node.js
* TLS
* TCP
* OpenSSL
* RSA Certificates
* ECDHE (performed internally by OpenSSL)

---

# 📂 Project Structure

```text
tls-echo/
│── client.js
│── server.js
│── package.json
│── package-lock.json
│── server.crt
│── README.md
│── TLS_EXPLAINED.md
└── .gitignore
```

> `server.key` is intentionally excluded from Git because it contains the server's private RSA key.

---

# 🚀 Getting Started

## Clone the repository

```bash
git clone <repository-url>
cd tls-echo
```

Install dependencies:

```bash
npm install
```

---

# 🔑 Generate a Self-Signed Certificate

Generate an RSA key pair and self-signed certificate using OpenSSL.

```bash
openssl req -x509 -newkey rsa:2048 -nodes -keyout server.key -out server.crt -days 365
```

This creates:

* `server.key` → Server's private RSA key
* `server.crt` → Server certificate containing the public key

---

# ▶️ Running the Project

Start the server:

```bash
node server.js
```

Open another terminal:

```bash
node client.js
```

Expected output:

```text
Connected!
Welcome!
Echo: Hello Server
```

---

# ⚙️ High-Level Workflow

```text
Client
   │
TCP Connection Established
   │
TLS Handshake
   │
Server Certificate Sent
   │
Certificate Verified
   │
ECDHE Key Exchange
   │
Shared Secret Generated
   │
Session Keys Created
   │
Encrypted Communication Begins
```

The application never sees the handshake. It simply receives a secure socket after the handshake succeeds.

---

# 💻 Code Walkthrough

## 1. Creating a TLS Server

```javascript
const server = tls.createServer(options, (socket) => {

});
```

Unlike `net.createServer()`, this callback is executed **only after**:

* TCP connection establishment
* TLS handshake
* Certificate exchange
* Key exchange
* Session key generation

At this point, the socket is already encrypted.

---

## 2. Loading the Private Key

```javascript
key: fs.readFileSync("server.key")
```

The private key is **never shared** with clients.

During the TLS handshake, OpenSSL uses this key to prove the server's identity by digitally signing the handshake.

---

## 3. Loading the Certificate

```javascript
cert: fs.readFileSync("server.crt")
```

The certificate contains:

* Server identity
* RSA public key
* Certificate metadata

The client uses the certificate to verify that it is communicating with the intended server.

---

## 4. Receiving a Secure Socket

```javascript
(socket) => {

}
```

This callback does **not** mean:

```text
TCP Connected
```

It means:

```text
TCP Connected
        │
TLS Handshake Successful
        │
Encrypted Socket Ready
```

---

## 5. Sending Data

```javascript
socket.write("Hello");
```

Your application writes **plaintext**.

Internally, TLS performs:

```text
Application Data
        │
        ▼
TLS Encryption
        │
        ▼
Encrypted TCP Packets
        │
        ▼
Internet
```

The receiving side automatically decrypts the packets before your application receives them.

---

# 📚 Key TLS Concepts Used

This project introduces several important networking and security concepts:

* TCP vs TLS
* TLS Handshake
* RSA Certificates
* ECDHE Key Exchange
* Session Key Generation
* Symmetric Encryption
* Secure Client-Server Communication

A complete explanation of these concepts is available in **`TLS_EXPLAINED.md`**.

---

# 🎯 What I Learned

Building this project helped me understand:

* The difference between TCP and TLS
* How a TLS handshake establishes trust before communication begins
* Why certificates are necessary for server authentication
* How Node.js uses OpenSSL internally
* Why RSA authenticates the server while ECDHE creates the shared secret
* How application data is encrypted transparently after the handshake
* Why HTTPS is simply HTTP running over TLS

---

# 🚀 Future Improvements

* Mutual TLS (mTLS)
* Multi-client secure chat
* Certificate validation using a trusted CA
* Secure file transfer
* Express + HTTPS implementation
* Wireshark packet analysis of the TLS handshake

---

# 📖 Additional Reading

For a detailed explanation of the protocol, including:

* TLS Handshake
* Diffie-Hellman (ECDHE)
* RSA Certificates
* Certificate Authorities (CA)
* Operating System Trust Store
* Root & Intermediate Certificates
* DigiCert verification
* Man-in-the-Middle attack scenarios
* What happens if an attacker modifies handshake messages
* Complete Node.js TLS workflow

see **[`TLS_EXPLAINED.md`](TLS_EXPLAINED.md)**.
