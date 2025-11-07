# blockchain/scripts/deploy_contract.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import hashlib, time
from connection import load_ledger,save_ledger
def initialize_ledger() -> None:
    chain = load_ledger()
    if chain:
        print("⚠️  Ledger already initialized. Nothing to do.")
        return

    genesis = {
        "index": 1,
        "timestamp": time.time(),
        "user_id": "SYSTEM",
        "record_hash": "0" * 64,
        "previous_hash": "0" * 64,
    }
    genesis["hash"] = hashlib.sha256(str(genesis).encode()).hexdigest()
    save_ledger([genesis])
    print(f"✅ Genesis block created | hash: {genesis['hash']}")

if __name__ == "__main__":
    initialize_ledger()
