import requests
import typer
import os

from dotenv import load_dotenv

load_dotenv()

from utils import BASE_URL, TOKEN_FILE, get_session_with_auth, save_token
from users import users_app
from machines import machines_app

app = typer.Typer()


# Basic commands
@app.command()
def status():
    """Check that server is running"""
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
def login():
    """Login with username and password from .env"""
    session = requests.Session()
    username = os.getenv("USER_NAME")
    password = os.getenv("PASSWORD")
    if not username or not password:
        typer.echo("❌ USER_NAME or PASSWORD not set in .env", err=True)
        raise typer.Exit(1)
    typer.echo(f"{BASE_URL}/login")
    try:
        response = session.post(
            f"{BASE_URL}/login", json={"username": username, "password": password}
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
    """Get user profile info from token"""
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
            typer.echo(
                f"❌typer.echo('try login') Failed: {response.status_code}", err=True
            )
    except Exception as e:
        typer.echo(f"❌ Error: {e}", err=True)


@app.command()
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


# Add sub apps
app.add_typer(users_app, name="users", help="User management commands (add, del)")
app.add_typer(
    machines_app, name="machines", help="Machine management commands (get, add)"
)

if __name__ == "__main__":
    app(prog_name="main.py")
