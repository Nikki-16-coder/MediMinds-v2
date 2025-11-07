# blockchain/scripts/mint_token.py
import json
from blockchain.config.settings import TOKENS_FILE

def _load_balances() -> dict:
    if TOKENS_FILE.exists():
        with open(TOKENS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def _save_balances(balances: dict) -> None:
    with open(TOKENS_FILE, "w", encoding="utf-8") as f:
        json.dump(balances, f, indent=2, ensure_ascii=False)

def mint_token(user_id: str, amount: int = 1) -> int:
    """
    Simulate issuing reward tokens to a user (for streaks, journaling, etc.).
    Returns the new total balance.
    """
    balances = _load_balances()
    balances[user_id] = int(balances.get(user_id, 0)) + int(amount)
    _save_balances(balances)
    total = balances[user_id]
    print(f"🪙 Minted {amount} token(s) to {user_id}. Total: {total}")
    return total

def balance_of(user_id: str) -> int:
    balances = _load_balances()
    return int(balances.get(user_id, 0))

if __name__ == "__main__":
    mint_token("demo_user", 5)
    print("Balance:", balance_of("demo_user"))
