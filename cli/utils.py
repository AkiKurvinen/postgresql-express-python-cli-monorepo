import requests
import json
import os
from pathlib import Path
from typing import Optional
import typer

BASE_URL = os.getenv("API_URL", "http://localhost:3000")
TOKEN_FILE = Path.home() / ".myapp" / "token.json"


# Helpers
def get_session_with_auth() -> tuple[requests.Session, Optional[str]]:
    """Get session with authentication if available"""
    session = requests.Session()
    token = None

    # Try to load token
    if TOKEN_FILE.exists():
        try:
            with open(TOKEN_FILE, "r") as f:
                data = json.load(f)
                token = data.get("token")
                if token:
                    session.headers.update({"Authorization": f"Bearer {token}"})
        except (json.JSONDecodeError, KeyError, FileNotFoundError):
            pass

    return session, token


def save_token(token: str) -> None:
    """Save token to file"""
    TOKEN_FILE.parent.mkdir(exist_ok=True)
    with open(TOKEN_FILE, "w") as f:
        json.dump({"token": token}, f)


def logout():
    """Logout user and delete token"""
    session, token = get_session_with_auth()
    if not token:
        typer.echo("❌ Not logged in. Please run 'login' first.", err=True)
        raise typer.Exit(1)

    try:
        response = session.post(f"{BASE_URL}/logout")
        if response.status_code == 200:
            TOKEN_FILE.unlink(missing_ok=True)
            typer.echo("✅ Successfully logged out.")
        else:
            typer.echo(f"❌ Logout failed: {response.status_code}", err=True)
    except Exception as e:
        typer.echo(f"❌ Logout error: {e}", err=True)
