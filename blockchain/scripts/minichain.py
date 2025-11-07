import hashlib, json, time
from pathlib import Path

LEDGER_FILE = Path("blockchain/ledger.json")

def log_to_chain(user_id: str, record_hash: str):
    """Append an immutable block to a local JSON ledger."""
    if LEDGER_FILE.exists():
        chain = json.loads(LEDGER_FILE.read_text())
    else:
        chain = []

    prev_hash = chain[-1]["hash"] if chain else "0"*64
    block = {
        "index": len(chain) + 1,
        "timestamp": time.time(),
        "user_id": user_id,
        "record_hash": record_hash,
        "previous_hash": prev_hash,
    }
    block["hash"] = hashlib.sha256(
        json.dumps(block, sort_keys=True).encode()
    ).hexdigest()

    chain.append(block)
    LEDGER_FILE.write_text(json.dumps(chain, indent=2))
    print(f"✅ Block {block['index']} added | hash: {block['hash']}")
    return block["hash"]
