import os
import google.generativeai as genai
from app.config import settings

# Configure Gemini client once
genai.configure(api_key=settings.GEMINI_API_KEY)

async def generate_gemini_response(user_message: str, context: str = "") -> str:
    """
    Generates an empathetic AI response using Gemini,
    combining current user message + retrieved RAG context
    (semantic + emotional history).
    """

    model = genai.GenerativeModel("gemini-flash-latest")

    prompt = f"""
    You are MediMinds, an empathetic mental wellness assistant.
    Your goal is to help users explore and regulate their emotions safely.
    Use a gentle, understanding tone — never judgmental or directive.

    ---
    🧠 Recent conversation context (semantic + emotional memory):
    {context if context.strip() else "No previous context available."}
    ---

    💬 User says:
    "{user_message}"

    ---
    🎯 Task:
    - Understand the emotional subtext of the message.
    - Reference relevant past experiences if they exist in context.
    - Respond briefly (1–3 sentences), offering comfort, validation,
      or a reflective question to deepen understanding.
    """

    try:
        response = model.generate_content(prompt)
        if hasattr(response, "text"):
            return response.text.strip()
        elif hasattr(response, "candidates") and response.candidates:
            return response.candidates[0].content.parts[0].text.strip()
        else:
            return "⚠️ Sorry, I couldn't generate a response this time."
    except Exception as e:
        return f"⚠️ Sorry, I’m having trouble responding right now ({e})."
