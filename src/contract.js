// This ABI exactly matches contracts/StudyProof.sol.
export const STUDY_PROOF_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "subject", "type": "string" },
      { "internalType": "string", "name": "note", "type": "string" }
    ],
    "name": "addCheckIn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "subject", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "note", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "CheckInAdded",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getCheckInCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }],
    "name": "getCheckIn",
    "outputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "string", "name": "subject", "type": "string" },
      { "internalType": "string", "name": "note", "type": "string" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
