# blockchain/config/settings.py
from pathlib import Path
from web3 import Web3

# Append-only JSON file that acts as our local "blockchain"
LEDGER_FILE = Path("blockchain/ledger.json")

# Optional local balances file for simulated rewards
TOKENS_FILE = Path("blockchain/tokens.json")

# URL for Ethereum node (local or remote)
ETHEREUM_URL = "http://127.0.0.1:8545"  # For Ganache, replace if using another node

# Initialize Web3 connection
w3 = Web3(Web3.HTTPProvider(ETHEREUM_URL))

# Check if the Web3 connection is successful
if w3.is_connected():
    print("✅ Web3 connection successful!")
else:
    print("❌ Web3 connection failed.")

print("✅ MediMinds MiniChain configuration loaded.")
