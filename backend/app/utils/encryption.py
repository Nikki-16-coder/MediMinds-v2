# app/utils/encryption.py
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes
import base64

# Encrypt a message using AES encryption
def encrypt_message(key: bytes, message: str):
    """
    Encrypts the message using AES encryption.
    Returns the encrypted message and IV (for decryption).
    """
    iv = get_random_bytes(AES.block_size)  # Generate random IV
    cipher = AES.new(key, AES.MODE_CBC, iv)
    encrypted_message = cipher.encrypt(pad(message.encode(), AES.block_size))
    return base64.b64encode(encrypted_message).decode('utf-8'), base64.b64encode(iv).decode('utf-8')

# Decrypt an encrypted message using AES encryption
def decrypt_message(key: bytes, encrypted_message: str, iv: str):
    """
    Decrypts the message using AES decryption.
    """
    cipher = AES.new(key, AES.MODE_CBC, base64.b64decode(iv))
    decrypted_message = unpad(cipher.decrypt(base64.b64decode(encrypted_message)), AES.block_size)
    return decrypted_message.decode('utf-8')
