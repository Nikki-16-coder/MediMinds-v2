# MediMinds MiniChain (Python-only Ledger)

This is a **Python-only append-only ledger** that mimics a simple blockchain:
- Stores **SHA-256 hashes** of sensitive records (chat summaries, mood logs).
- Each block includes `previous_hash` → tamper-evident chain.
- No gas, no RPC, no Node.js, no external networks.

## Files
- `config/settings.py` — paths to ledger files
- `scripts/connection.py` — load/save the JSON ledger
- `scripts/deploy_contract.py` — creates the genesis block
- `scripts/log_record.py` — appends hashed records & verifies existence
- `scripts/mint_token.py` — optional simulated rewards (`tokens.json`)
- `contracts/` — reference Solidity contracts (not required for MiniChain)

## Quickstart
```bash
# 1) Create genesis block
python blockchain/scripts/deploy_contract.py

# 2) Log a record hash (from Python REPL or your app)
python -c "from blockchain.scripts.log_record import log_record; log_record('test_user','Feeling positive today')"

# 3) Verify a hash exists
python - <<'PY'
from hashlib import sha256
from blockchain.scripts.log_record import verify_record_hash
h = sha256('Feeling positive today'.encode()).hexdigest()
print('exists?', verify_record_hash(h))
PY
