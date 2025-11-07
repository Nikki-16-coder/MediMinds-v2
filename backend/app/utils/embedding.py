# app/utils/embedding.py
import numpy as np
import hashlib

# 🧩 Placeholder deterministic embedding (replace later with Gemini embedding API)
def get_text_embedding(text: str) -> list[float]:
    """
    Returns a 512-dimensional pseudo-embedding for the given text.
    Replace this later with Gemini embedding API call.
    """
    digest = hashlib.sha256(text.encode("utf-8")).digest()
    arr = np.frombuffer(digest, dtype=np.uint8)
    arr = np.resize(arr, 512)        # make it 512-D
    return (arr / 255.0).tolist()
