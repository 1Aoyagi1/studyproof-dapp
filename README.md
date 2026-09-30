# StudyProof — Decentralized Study Check-in

StudyProof is a small DApp for recording study check-ins on the **Ethereum Sepolia test network**. A user connects MetaMask, enters a subject and note, then confirms a blockchain transaction. The React frontend reads all records directly from the smart contract; there is no database or backend.

## Prerequisites

- A computer with **Node.js 18+** installed. Check with `node -v`.
- Chrome, Edge, or another desktop browser with the **MetaMask** extension.
- A MetaMask account set to **Ethereum Sepolia** with a small amount of free SepoliaETH for test transactions.
- A GitHub account and a Render account for deployment.

> **Important:** MetaMask browser extensions generally do not work in a mobile browser. Do the deployment and classroom demo on a computer.

## STEP 1 — Install dependencies

Open a terminal inside the `studyproof` folder and run:

```bash
npm install
```

## STEP 2 — Run the frontend locally

```bash
npm run dev
```

Open the local address shown in the terminal (normally `http://localhost:5173`). At this point, the page works but intentionally shows a setup message because the contract address has not yet been added.

## STEP 3 — Open Remix and create `StudyProof.sol`

1. Go to [Remix IDE](https://remix.ethereum.org/).
2. In the left **File explorers** panel, click the `contracts` folder (or create one).
3. Click **New File** and name it `StudyProof.sol`.
4. Open this project’s local file `contracts/StudyProof.sol`.
5. Copy its **entire contents** into Remix and save (`Ctrl/Cmd + S`).

## STEP 4 — Compile the contract

1. In Remix’s left bar, click the Solidity logo: **Solidity compiler**.
2. Confirm the selected compiler is version `0.8.20` or any compatible `0.8.x` version.
3. Click **Compile StudyProof.sol**.
4. A green success mark means the contract compiled correctly.

## STEP 5 — Switch MetaMask to Ethereum Sepolia

1. Open MetaMask.
2. Use the network drop-down at the top and choose **Sepolia test network**.
3. If Sepolia is hidden, open MetaMask **Settings → Advanced → Show test networks**, then enable it.
4. Make sure the account has a little **SepoliaETH**. It is test currency, not real ETH. Use a Sepolia faucet if necessary.

## STEP 6 — Deploy with Remix + MetaMask

1. In Remix, click the Ethereum logo: **Deploy & run transactions**.
2. Set **Environment** to `Injected Provider - MetaMask`.
3. MetaMask may ask permission to connect. Approve it and make sure the network reads **Sepolia**.
4. Under **Contract**, select `StudyProof`.
5. Click the orange **Deploy** button. There are no constructor arguments.
6. MetaMask opens: review it and click **Confirm**.
7. Wait until Remix shows **Deployed Contracts**. Expand the new `StudyProof` item.
8. Copy the contract address shown next to the deployed contract (it starts with `0x`). This must be the address deployed on Sepolia.

## STEP 7 — Copy the contract address

Keep the copied `0x...` Sepolia address ready. Do not copy a transaction hash: the contract address is listed under **Deployed Contracts** in Remix.

## STEP 8 — Update `src/config.js`

Open `src/config.js` and replace only the placeholder string:

```js
export const CONTRACT_ADDRESS = "PASTE_CONTRACT_ADDRESS_HERE";
```

For example:

```js
export const CONTRACT_ADDRESS = "0x1234567890abcdef1234567890abcdef12345678";
```

Save the file. Do not change the ABI in `src/contract.js`.

## STEP 9 — Test locally

1. If `npm run dev` is still running, refresh the browser. Otherwise start it again with `npm run dev`.
2. Click **Connect Wallet** and approve MetaMask.
3. Confirm the page says **Sepolia Network ✓**.
4. Enter a subject, for example `SC6104 Cryptography`.
5. Enter a note, for example `Reviewed RSA today`.
6. Click **Record on Blockchain**, then confirm the transaction in MetaMask.
7. Wait for the success message. The new record should appear at the top of **Blockchain Records**.

## STEP 10 — Upload to GitHub

### Easy browser method

1. Go to [GitHub](https://github.com/) and click **New repository**.
2. Name it `studyproof-dapp`, choose **Public**, and click **Create repository**.
3. On the new repository page, click **uploading an existing file**.
4. Drag every item *inside* this `studyproof` folder into GitHub. Include `src`, `contracts`, `package.json`, and the other project files. Do **not** upload `node_modules` or `dist`.
5. Scroll down and click **Commit changes**.

### Terminal method (optional)

After creating an empty GitHub repository, run these commands inside the `studyproof` folder. Replace the URL with your own repository URL.

```bash
git init
git add .
git commit -m "Create StudyProof DApp"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/studyproof-dapp.git
git push -u origin main
```

## STEP 11 — Deploy a Render Static Site

1. Go to [Render](https://render.com/) and sign in, preferably with GitHub.
2. Click **New + → Static Site**.
3. Connect GitHub if asked, select the `studyproof-dapp` repository, and click **Connect**.
4. Use these exact settings:

| Render setting | Value |
| --- | --- |
| Name | `studyproof-dapp` (or any available name) |
| Branch | `main` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

5. Click **Create Static Site**.
6. Wait for the build and deployment to become **Live**. Render will show a public `onrender.com` URL.

## STEP 12 — Check the public URL

1. Open the Render URL in a desktop browser with MetaMask installed.
2. Connect the wallet and ensure it is on Sepolia.
3. Make one check-in and confirm it in MetaMask.
4. Refresh the page or click **Refresh Records**. The record must still be visible because it is read from Sepolia, not browser storage.

## Troubleshooting

- **“MetaMask not detected”**: open the site in a desktop browser where the MetaMask extension is installed and unlocked.
- **“Wrong Network”**: click **Switch to Sepolia**, or switch networks directly in MetaMask.
- **Records do not load**: confirm `src/config.js` contains the deployed **Sepolia contract address**, then commit/push again so Render rebuilds.
- **Transaction fails**: confirm MetaMask has SepoliaETH and the subject/note are not empty.
- **Render shows an old version**: check that the contract-address change was committed to GitHub, then use Render’s **Manual Deploy → Deploy latest commit**.

## 30–60 second classroom demo script

> This is StudyProof, a decentralized study check-in DApp. The frontend is a React application hosted on Render, and the study records are stored by a Solidity smart contract on the Ethereum Sepolia testnet. First, I connect MetaMask. Then I enter a subject and a short study note. When I click “Record on Blockchain,” MetaMask asks me to confirm a blockchain transaction. After the transaction is confirmed, the app reads the contract again and shows the new permanent study record with my wallet address and timestamp.

## Short Q&A for class

**Why is this a DApp?**  The frontend interacts directly with a Solidity smart contract using MetaMask and ethers.js. The important data is stored and retrieved from a blockchain, not a normal server database.

**Where is the data stored?**  Each study check-in is stored in the `StudyProof` smart contract on Ethereum Sepolia.

**What does Render host?**  Render hosts only the static React frontend files. It does not host the study records or a backend.

**Which blockchain are you using?**  Ethereum Sepolia, which is Ethereum’s public test network.

**Why do you need MetaMask?**  MetaMask provides the user’s wallet, connects the browser to Sepolia, and lets the user sign the transaction that writes a check-in.

**What does the smart contract do?**  It saves the sender wallet address, subject, note, and block timestamp for each check-in, and exposes read functions for the frontend.

**Why are you using Sepolia instead of Ethereum Mainnet?**  Sepolia is a public test network, so it allows safe classroom testing with free test ETH and no real transaction cost.
