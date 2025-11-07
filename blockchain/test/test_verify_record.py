# blockchain/scripts/test_verify_record.py

import os
import sys
from hashlib import sha256

# ✅ Add the parent of 'blockchain' to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
project_parent = os.path.abspath(os.path.join(current_dir, os.pardir, os.pardir))
if project_parent not in sys.path:
    sys.path.insert(0, project_parent)

from blockchain.scripts.log_record import verify_record_hash

def test_verify_record():
    text = "I feel happy today after my workout."

    # Create the hash of the text
    record_hash = sha256(text.encode()).hexdigest()

    # Check if the record exists in the blockchain ledger
    exists = verify_record_hash(record_hash)

    # Assert that the record exists
    assert exists is True, "❌ Record hash not found in the blockchain."
    print("✅ Test passed! Record hash exists in the ledger.")

if __name__ == "__main__":
    test_verify_record()
