import { useCallback, useEffect, useState } from "react";
import { BrowserProvider, Contract, ethers } from "ethers";
import { CONTRACT_ADDRESS, SEPOLIA_CHAIN_ID, SEPOLIA_CHAIN_ID_HEX } from "./config";
import { STUDY_PROOF_ABI } from "./contract";

const shortAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;
const isConfigured = () => ethers.isAddress(CONTRACT_ADDRESS);

function App() {
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState(null);
  const [subject, setSubject] = useState("");
  const [note, setNote] = useState("");
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("");
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const hasMetaMask = typeof window !== "undefined" && Boolean(window.ethereum);
  const onSepolia = chainId === SEPOLIA_CHAIN_ID;

  const getProvider = () => new BrowserProvider(window.ethereum);

  const readRecords = useCallback(async () => {
    if (!hasMetaMask || !isConfigured()) return;
    setLoadingRecords(true);
    try {
      const provider = getProvider();
      const contract = new Contract(CONTRACT_ADDRESS, STUDY_PROOF_ABI, provider);
      const count = Number(await contract.getCheckInCount());
      const fetched = await Promise.all(
        Array.from({ length: count }, (_, index) => contract.getCheckIn(index))
      );
      setRecords(
        fetched
          .map((item) => ({
            user: item[0],
            subject: item[1],
            note: item[2],
            timestamp: Number(item[3])
          }))
          .reverse()
      );
    } catch (error) {
      console.error(error);
      setStatus("Could not load records. Confirm the contract address is a deployed Sepolia contract.");
    } finally {
      setLoadingRecords(false);
    }
  }, [hasMetaMask]);

  const syncWallet = useCallback(async () => {
    if (!hasMetaMask) return;
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      setAccount(accounts[0] || "");
      const hexChainId = await window.ethereum.request({ method: "eth_chainId" });
      setChainId(parseInt(hexChainId, 16));
    } catch (error) {
      console.error(error);
    }
  }, [hasMetaMask]);

  useEffect(() => {
    syncWallet();
    if (!hasMetaMask) return undefined;
    const onAccountsChanged = (accounts) => setAccount(accounts[0] || "");
    const onChainChanged = (hexId) => setChainId(parseInt(hexId, 16));
    window.ethereum.on("accountsChanged", onAccountsChanged);
    window.ethereum.on("chainChanged", onChainChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", onAccountsChanged);
      window.ethereum.removeListener("chainChanged", onChainChanged);
    };
  }, [hasMetaMask, syncWallet]);

  useEffect(() => {
    if (onSepolia && isConfigured()) readRecords();
  }, [onSepolia, readRecords]);

  const connectWallet = async () => {
    if (!hasMetaMask) {
      setStatus("MetaMask was not detected. Install the MetaMask browser extension to use StudyProof.");
      return;
    }
    try {
      setStatus("Waiting for wallet connection...");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      await syncWallet();
      setStatus("Wallet connected.");
    } catch (error) {
      setStatus(error.code === 4001 ? "Wallet connection was cancelled." : "Could not connect wallet.");
    }
  };

  const switchToSepolia = async () => {
    if (!hasMetaMask) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }]
      });
      await syncWallet();
      setStatus("Switched to Ethereum Sepolia.");
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: SEPOLIA_CHAIN_ID_HEX,
              chainName: "Sepolia test network",
              nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
              rpcUrls: ["https://rpc.sepolia.org"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"]
            }]
          });
          await syncWallet();
        } catch (addError) {
          setStatus("Could not add Sepolia to MetaMask.");
        }
      } else if (error.code === 4001) {
        setStatus("Network switch was cancelled.");
      } else {
        setStatus("Could not switch to Sepolia.");
      }
    }
  };

  const submitCheckIn = async (event) => {
    event.preventDefault();
    if (!subject.trim() || !note.trim()) {
      setStatus("Please enter both a subject and a note.");
      return;
    }
    if (!hasMetaMask) return setStatus("Install MetaMask to record a check-in.");
    if (!account) return setStatus("Please connect your wallet first.");
    if (!onSepolia) return setStatus("Please switch MetaMask to Ethereum Sepolia first.");
    if (!isConfigured()) return setStatus("Add your deployed Sepolia contract address in src/config.js first.");

    setSubmitting(true);
    try {
      setStatus("Waiting for wallet confirmation...");
      const provider = getProvider();
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, STUDY_PROOF_ABI, signer);
      const tx = await contract.addCheckIn(subject.trim(), note.trim());
      setStatus(`Transaction submitted: ${tx.hash.slice(0, 10)}... Waiting for blockchain confirmation...`);
      await tx.wait();
      setSubject("");
      setNote("");
      setStatus("Check-in recorded successfully!");
      await readRecords();
    } catch (error) {
      console.error(error);
      setStatus(error.code === 4001 ? "Transaction was cancelled in MetaMask." : "Transaction failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">ON-CHAIN LEARNING LOG</p>
        <h1>Study<span>Proof</span></h1>
        <p className="subtitle">Decentralized Study Check-in</p>
        <p className="intro">Record your study progress permanently on the blockchain.</p>
      </section>

      <section className="panel wallet-panel">
        <div>
          <h2>Wallet & Network</h2>
          {!hasMetaMask ? <p className="warning">MetaMask not detected. Install it to connect and submit records.</p> : (
            <p>{account ? <>Connected: <code>{shortAddress(account)}</code></> : "No wallet connected"}</p>
          )}
        </div>
        <div className="wallet-actions">
          <span className={`network-badge ${onSepolia ? "success" : "danger"}`}>
            {onSepolia ? "Sepolia Network ✓" : "Wrong Network — Please switch to Sepolia"}
          </span>
          {!account && <button onClick={connectWallet}>Connect Wallet</button>}
          {hasMetaMask && !onSepolia && <button className="secondary" onClick={switchToSepolia}>Switch to Sepolia</button>}
        </div>
      </section>

      <section className="panel form-panel">
        <div className="section-heading"><h2>Add Study Check-in</h2><span>Write a permanent learning record</span></div>
        <form onSubmit={submitCheckIn}>
          <label>Subject<input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. SC6104 Cryptography" maxLength="120" disabled={submitting} /></label>
          <label>Note<textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Reviewed RSA today" maxLength="280" rows="4" disabled={submitting} /></label>
          <button type="submit" disabled={submitting}>{submitting ? "Recording..." : "Record on Blockchain"}</button>
        </form>
        {status && <p className="status" aria-live="polite">{status}</p>}
        {!isConfigured() && <p className="setup-note">Setup required: deploy <code>StudyProof.sol</code> on Sepolia, then paste its address into <code>src/config.js</code>.</p>}
      </section>

      <section className="panel records-panel">
        <div className="records-header"><div className="section-heading"><h2>Blockchain Records</h2><span>Read directly from the smart contract</span></div><button className="secondary" onClick={readRecords} disabled={loadingRecords || !isConfigured()}>{loadingRecords ? "Refreshing..." : "Refresh Records"}</button></div>
        {!isConfigured() ? <p className="empty">Your records will appear here after you deploy the contract and update its address.</p> : records.length === 0 && !loadingRecords ? <p className="empty">No check-ins yet. Be the first to record one.</p> : <div className="record-list">{records.map((record, index) => <article className="record" key={`${record.user}-${record.timestamp}-${index}`}><div className="record-top"><h3>{record.subject}</h3><time>{new Date(record.timestamp * 1000).toLocaleString()}</time></div><p>{record.note}</p><small>Wallet: <code>{shortAddress(record.user)}</code></small></article>)}</div>}
      </section>
      <footer>Network: Ethereum Sepolia · Powered by Ethereum & MetaMask</footer>
    </main>
  );
}

export default App;
