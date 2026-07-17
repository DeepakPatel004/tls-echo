# TLS Explained

> A beginner-friendly guide to understanding how TLS secures communication over the internet.

---

# Table of Contents

1. Why Do We Need TLS?
2. TCP vs TLS
3. What Is a TLS Server?
4. How Does TLS Work?
5. The TLS Handshake
6. Symmetric vs Asymmetric Encryption
7. RSA and Public Key Cryptography
8. Diffie–Hellman Key Exchange
9. Why Diffie–Hellman Alone Is Not Secure
10. Man-in-the-Middle (MITM) Attack Scenarios
11. How Certificates Prevent MITM Attacks
12. Certificate Authorities (CA)
13. How the Operating System Verifies Certificates
14. DigiCert, Let's Encrypt, and Trusted Root Certificates
15. Why Replacing the Certificate Doesn't Work
16. What Happens After the Handshake?
17. TLS 1.2 vs TLS 1.3
18. Common Misconceptions
19. Key Takeaways

---

# 1. Why Do We Need TLS?

Imagine sending your password over a normal TCP connection.

```
Client
    |
    |  Username: alice
    |  Password: mypassword
    |
Server
```

Anyone monitoring the network can read your data because TCP provides **reliable delivery**, not **security**.

TLS solves this problem by providing:

* Encryption
* Authentication
* Data Integrity

---

# 2. TCP vs TLS

TCP guarantees:

* Ordered delivery
* Reliable transmission
* Error checking

But TCP does **not** provide:

* Encryption
* Identity verification
* Protection from attackers

TLS sits on top of TCP.

```
Application

↓

TLS

↓

TCP

↓

IP
```

TCP delivers the bytes.

TLS protects the bytes.

---

# 3. What Is a TLS Server?

A TLS server is simply a TCP server that performs a TLS handshake before exchanging application data.

Without TLS:

```
Application

↓

TCP
```

With TLS:

```
Application

↓

TLS

↓

TCP
```

After the handshake, the application reads and writes plaintext while TLS transparently encrypts and decrypts the network traffic.

---

# 4. How Does TLS Work?

TLS has two main phases.

## Phase 1 — Handshake

The client and server:

* Verify identities
* Agree on encryption algorithms
* Generate a shared secret

## Phase 2 — Secure Communication

All application data is encrypted using fast symmetric encryption (such as AES-GCM or ChaCha20-Poly1305).

---

# 5. The TLS Handshake

A simplified TLS 1.3 handshake:

```
Client -----------------------------> Server
        ClientHello

Client <----------------------------- Server
        ServerHello
        Certificate
        ECDHE Public Key
        Digital Signature

Client -----------------------------> Server
        ECDHE Public Key

Both compute the same shared secret

↓

HKDF derives session keys

↓

Encrypted communication begins
```

---

# 6. Symmetric vs Asymmetric Encryption

## Symmetric Encryption

One key encrypts and decrypts.

Example:

```
Shared Key

↓

Encrypt

↓

Decrypt
```

Advantages:

* Very fast
* Ideal for large amounts of data

Examples:

* AES
* ChaCha20

---

## Asymmetric Encryption

Uses two keys.

```
Public Key

Private Key
```

Public key:

* Shared with everyone

Private key:

* Kept secret

Examples:

* RSA
* Elliptic Curve Cryptography (ECC)

TLS uses asymmetric cryptography only during the handshake.

---

# 7. RSA and Public Key Cryptography

RSA provides identity.

The server owns:

* Public key
* Private key

The public key is included inside the server's certificate.

The private key never leaves the server.

Modern TLS uses RSA primarily for **digital signatures**, not for encrypting all application data.

---

# 8. Diffie–Hellman Key Exchange

Diffie–Hellman allows two strangers to create the same secret over an insecure network.

Each side generates:

* A private value
* A public value

They exchange only the public values.

Both independently calculate the same shared secret.

An observer can see the public values but cannot feasibly recover the shared secret because of the discrete logarithm problem.

Modern TLS uses **Ephemeral Elliptic Curve Diffie–Hellman (ECDHE)**, which also provides **forward secrecy**.

---

# 9. Why Diffie–Hellman Alone Is Not Secure

Classic Diffie–Hellman solves one problem:

> "How do two strangers agree on a shared secret?"

It does **not** solve:

> "How do I know I'm talking to the real server?"

Without authentication, an attacker can stand between both parties.

```
Alice

↓

Mallory

↓

Bob
```

Alice believes she is talking to Bob.

Bob believes he is talking to Alice.

Both are actually communicating through Mallory.

---

# 10. Man-in-the-Middle (MITM) Attack Scenarios

## Case 1 — Attacker Changes Only the ECDHE Public Key

The attacker replaces the server's public key.

Result:

* Signature verification fails.
* The TLS connection is terminated.

---

## Case 2 — Attacker Changes the Public Key and the Signature

The attacker now modifies:

* ECDHE public key
* Digital signature

Problem:

The attacker does **not** have the server's private RSA key.

Without the private key, a valid signature cannot be created.

The client rejects the handshake.

---

## Case 3 — Attacker Replaces the Entire Certificate

Suppose the attacker sends:

* A different certificate
* Their own public key
* A valid signature created using their own private key

Now the client asks:

> "Do I trust this certificate?"

The answer is **No**, because it is not issued by a trusted Certificate Authority.

The connection is rejected.

---

## Case 4 — Attacker Creates Their Own Certificate

Imagine an attacker generates:

```
mallory.crt

mallory.key
```

They sign everything correctly.

Technically, the cryptography is valid.

However, the operating system checks:

```
Who signed this certificate?
```

If the signer is not trusted, the handshake fails.

---

## Case 5 — Attacker Modifies Encrypted Data

Suppose the handshake succeeds but an attacker later changes encrypted packets.

TLS detects this because every encrypted record includes authentication data.

The receiver immediately rejects the modified packet.

---

# 11. How Certificates Prevent MITM Attacks

A certificate binds:

* A domain name
* A public key
* A digital signature from a trusted Certificate Authority

Example:

```
www.example.com

↓

Public Key

↓

Signed by DigiCert
```

The certificate proves:

"This public key belongs to this domain."

---

# 12. Certificate Authorities (CA)

A Certificate Authority verifies ownership of a domain before issuing a certificate.

Examples include:

* DigiCert
* Let's Encrypt
* GlobalSign
* Sectigo

Browsers and operating systems trust these authorities because their **root certificates** are pre-installed.

---

# 13. How the Operating System Verifies Certificates

During the TLS handshake:

1. The server sends its certificate.
2. The operating system reads the certificate.
3. It checks who signed it.
4. It follows the certificate chain back to a trusted root certificate.
5. If the chain is valid, the certificate is trusted.
6. Otherwise, the connection is rejected.

This is known as the **chain of trust**.

---

# 14. DigiCert, Let's Encrypt, and Trusted Root Certificates

Companies such as DigiCert and Let's Encrypt issue certificates.

Operating systems and browsers maintain a **Trusted Root Store** containing trusted root certificates.

If the certificate chain leads back to one of these trusted roots, the certificate is accepted.

If it does not, users see warnings such as:

* "Your connection is not private"
* "Certificate not trusted"
* "NET::ERR_CERT_AUTHORITY_INVALID"

---

# 15. Why Replacing the Certificate Doesn't Work

An attacker cannot simply replace the certificate because trust is not based on the certificate alone.

The client verifies:

* Is the certificate signed by a trusted CA?
* Is the domain name correct?
* Is the certificate still valid?
* Has it expired?
* Has it been revoked?

If any check fails, the handshake is terminated.

---

# 16. What Happens After the Handshake?

Once the handshake completes:

```
ECDHE Shared Secret

↓

HKDF

↓

Session Keys

↓

AES-GCM / ChaCha20-Poly1305

↓

Encrypted Communication
```

From this point onward:

* RSA is no longer used.
* Certificates are no longer needed.
* Every application message is protected using symmetric encryption.

---

# 17. TLS 1.2 vs TLS 1.3

| Feature          | TLS 1.2   | TLS 1.3   |
| ---------------- | --------- | --------- |
| Handshake        | Longer    | Shorter   |
| RSA Key Exchange | Supported | Removed   |
| ECDHE            | Optional  | Mandatory |
| Forward Secrecy  | Optional  | Always    |
| Security         | Strong    | Stronger  |

TLS 1.3 simplifies the protocol, removes outdated algorithms, and improves both security and performance.

---

# 18. Common Misconceptions

**"RSA encrypts all HTTPS traffic."**
No. RSA authenticates the server. Application data is encrypted with symmetric algorithms.

**"TCP is secure."**
No. TCP provides reliable transport but no confidentiality or authentication.

**"Diffie–Hellman authenticates the server."**
No. Diffie–Hellman establishes a shared secret. Certificates provide authentication.

**"Anyone can create a certificate."**
Anyone can create a certificate, but clients only trust certificates that chain back to a trusted Certificate Authority.

**"Changing encrypted packets lets attackers modify messages."**
No. TLS detects tampering through authenticated encryption, and altered records are rejected.

---

# 19. Key Takeaways

* TCP provides reliable transport, not security.
* TLS adds encryption, authentication, and integrity.
* RSA identifies the server through digital signatures.
* ECDHE creates a fresh shared secret for every connection.
* Certificates bind a public key to a domain name.
* Certificate Authorities issue trusted certificates.
* Operating systems verify certificate chains using their trusted root stores.
* Modern TLS uses symmetric encryption after the handshake for speed.
* Without certificates, Diffie–Hellman is vulnerable to man-in-the-middle attacks.
* TLS 1.3 combines authentication, key exchange, and authenticated encryption to provide secure communication on today's Internet.
