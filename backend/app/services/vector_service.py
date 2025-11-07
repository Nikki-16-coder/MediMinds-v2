from datetime import datetime
from pymongo import ASCENDING
from app.database import db
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from textblob import TextBlob  # lightweight sentiment analysis

vectors_collection = db["chat_vectors"]

# ---------- SAVE EMBEDDING ----------
async def save_embedding(user_id: str, text: str, embedding: list[float]):
    """
    Saves a message embedding with timestamp.
    """
    doc = {
        "user_id": user_id,
        "text": text,
        "embedding": embedding,
        "created_at": datetime.utcnow(),
    }
    await vectors_collection.insert_one(doc)

# ---------- EMOTION + RECENCY-AWARE CONTEXT RETRIEVAL ----------
async def find_similar_texts(user_id: str, query_embedding: list[float], limit: int = 3):
    """
    Finds semantically similar past messages for RAG context.
    Weighs results by emotion (sentiment intensity) and recency.
    """
    vectors = await vectors_collection.find({"user_id": user_id}).to_list(None)
    if not vectors:
        return []

    # Step 1: Extract embeddings and compute cosine similarity
    emb_matrix = np.array([v["embedding"] for v in vectors])
    sims = cosine_similarity([query_embedding], emb_matrix)[0]

    # Step 2: Compute emotional weight using sentiment intensity
    def emotion_weight(text):
        polarity = abs(TextBlob(text).sentiment.polarity)
        return 1.0 + (polarity * 0.5)  # range ~1.0–1.5

    emotion_weights = np.array([emotion_weight(v["text"]) for v in vectors])

    # Step 3: Compute recency weight (newer messages slightly higher)
    timestamps = np.array([v.get("created_at", datetime.utcnow()).timestamp() for v in vectors])
    if len(timestamps) > 1:
        time_norm = (timestamps - timestamps.min()) / (timestamps.max() - timestamps.min() + 1e-6)
    else:
        time_norm = np.ones_like(timestamps)
    recency_weights = 1.0 + (time_norm * 0.3)  # up to +30% for recent messages

    # Step 4: Combine all weights
    weighted_scores = sims * emotion_weights * recency_weights

    # Step 5: Return top relevant texts
    sorted_indices = np.argsort(weighted_scores)[::-1][:limit]
    return [vectors[i]["text"] for i in sorted_indices]
