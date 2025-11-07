# blockchain/test/test_log_record.py

import os
import sys
from hashlib import sha256

import os
import sys

# ✅ Ensure the parent of 'blockchain' is in sys.path
project_parent = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir, os.pardir))
if project_parent not in sys.path:
    sys.path.insert(0, project_parent)


# ✅ Now imports will always work
from blockchain.scripts.log_record import log_record

def test_log_record():
    user_id = "test_user"
    text = "I feel happy today after my workout."

    # Log the record and capture the returned block
    block = log_record(user_id, text)

    # Verify the block contains the expected information
    assert block['user_id'] == user_id, f"Expected {user_id}, but got {block['user_id']}"
    assert block['record_hash'] == sha256(text.encode()).hexdigest(), "Record hash mismatch."
    print(f"✅ Test passed! Block logged successfully: {block}")

if __name__ == "__main__":
    test_log_record()
