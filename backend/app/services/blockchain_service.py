from blockchain.scripts.log_record import log_record, verify_record_hash
from hashlib import sha256

async def add_record_to_blockchain(user_id: str, data: str):
    """
    Logs a hash of the user's data (summary/mood) into the blockchain.
    Returns the created block.
    """
    block = log_record(user_id, data)
    return block

async def verify_record_integrity(data: str) -> bool:
    """
    Verifies whether a data hash exists in the blockchain ledger.
    """
    record_hash = sha256(data.encode()).hexdigest()
    return verify_record_hash(record_hash)
