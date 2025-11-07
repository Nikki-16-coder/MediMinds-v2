# blockchain/scripts/connection.py
import os
import json
from typing import List, Dict, Any

# ✅ Define ledger file relative to the project root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEDGER_FILE = os.path.join(BASE_DIR, "ledger.json")

def load_ledger() -> List[Dict[str, Any]]:
    """Load the blockchain ledger if it exists, else return an empty chain."""
    if os.path.exists(LEDGER_FILE):
        with open(LEDGER_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    print("ℹ️ No existing ledger found. Initializing new ledger...")
    return []

def save_ledger(chain: List[Dict[str, Any]]) -> None:
    """Save the blockchain ledger safely (creates file if missing)."""
    os.makedirs(BASE_DIR, exist_ok=True)
    with open(LEDGER_FILE, "w", encoding="utf-8") as f:
        json.dump(chain, f, indent=2, ensure_ascii=False)
    print(f"✅ Ledger updated at: {LEDGER_FILE}")
