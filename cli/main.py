import requests
from typing import Optional
from pathlib import Path
import json
import typer
import requests
from typing import Optional
from pathlib import Path
import json
from dotenv import load_dotenv
import os

app = typer.Typer()
load_dotenv()
BASE_URL = os.getenv("API_URL", "http://localhost:3000")
TOKEN_FILE = Path.home() / ".myapp" / "token.json"

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
                    session.headers.update({
                        "Authorization": f"Bearer {token}"
                    })
        except (json.JSONDecodeError, KeyError, FileNotFoundError):
            pass
    
    return session, token

def save_token(token: str) -> None:
    """Save token to file"""
    TOKEN_FILE.parent.mkdir(exist_ok=True)
    with open(TOKEN_FILE, "w") as f:
        json.dump({"token": token}, f)

@app.command()
def login():
    """Login with username and password from .env"""
    session = requests.Session()
    username = os.getenv("USER_NAME")
    password = os.getenv("PASSWORD")
    if not username or not password:
        typer.echo("❌ USER_NAME or PASSWORD not set in .env", err=True)
        raise typer.Exit(1)
    typer.echo(f'{BASE_URL}/login')
    try:
        response = session.post(
            f"{BASE_URL}/login",
            json={"username": username, "password": password}
        )
        if response.status_code == 200:
            data = response.json()
            token = data.get("token")
            if token:
                save_token(token)
                typer.echo(f"✅ Successfully logged in as {username}")
            else:
                typer.echo("❌ No token received", err=True)
        else:
            typer.echo(f"❌ Login failed: {response.status_code}", err=True)
    except Exception as e:
        typer.echo(f"❌ Login error: {e}", err=True)

@app.command()
def profile():
    """Get user profile"""
    session, token = get_session_with_auth()
    
    if not token:
        typer.echo("❌ Not logged in. Please run 'login' first.", err=True)
        raise typer.Exit(1)
    
    try:
        response = session.get(f"{BASE_URL}/profile")
        if response.status_code == 200:
            profile = response.json()
            typer.echo(f"Name: {profile.get('user')}")
        else:
            typer.echo(f"❌typer.echo('try login') Failed: {response.status_code}", err=True)
    except Exception as e:
        typer.echo(f"❌ Error: {e}", err=True)

@app.command()
def status():
    """Check server status (GET /)"""
    session = requests.Session()
    try:
        response = session.get(BASE_URL)
        if response.status_code == 200:
            typer.echo(response.json())
        else:
            typer.echo(f"❌ Status check failed: {response.status_code}", err=True)
    except Exception as e:
        typer.echo(f"❌ Error: {e}", err=True)

@app.command()
def logout():
    """Logout the user (POST /logout)"""
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

if __name__ == "__main__":
    app(prog_name="main.py")
