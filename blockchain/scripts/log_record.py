# blockchain/scripts/log_record.py
from blockchain.config.settings import w3
from web3 import Web3
import json
import hashlib

def log_record(user_id, encrypted_message):
    """
    Logs the encrypted chat message to the blockchain.
    """
    try:
        contract_address = "your_contract_address"  # Set your contract address here
        abi_path = "blockchain/contracts/RecordLogger.json"  # ABI for the contract

        # Load ABI and set up Web3 connection
        with open(abi_path, "r") as file:
            abi = json.load(file)
        
        contract = w3.eth.contract(address=contract_address, abi=abi)
        account = w3.eth.account.privateKeyToAccount("your_private_key")  # Set your private key
        
        # Prepare transaction for blockchain logging
        tx = contract.functions.logMessage(user_id, encrypted_message).buildTransaction({
            'from': account.address,
            'gas': 2000000,
            'gasPrice': w3.toWei('20', 'gwei'),
            'nonce': w3.eth.getTransactionCount(account.address),
        })

        # Sign and send the transaction
        signed_tx = w3.eth.account.signTransaction(tx, private_key="your_private_key")
        tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
        print(f"Transaction successful with hash: {tx_hash.hex()}")

    except Exception as e:
        print(f"Blockchain logging failed: {e}")

def verify_record_hash(record_hash: str, expected_hash: str) -> bool:
    """
    Verifies if the provided record hash matches the expected hash.

    :param record_hash: The hash of the record to verify.
    :param expected_hash: The expected hash to compare against.
    :return: True if hashes match, False otherwise.
    """
    return record_hash == expected_hash
