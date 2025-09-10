from typing import Optional
import typer
import os

users_app = typer.Typer()
from utils import BASE_URL, get_session_with_auth

# Users command group

@users_app.command('add')
def add_user(
    username: str,
    password: str,
    role: Optional[str] = typer.Argument(None)
):
    """Add a new user (register)"""
    session, token = get_session_with_auth()
    payload = {"username": username, "password": password}
    if role:
        payload["role"] = role
    try:
        response = session.post(f"{BASE_URL}/register", json=payload)
        if response.status_code == 201:
            data = response.json()
            typer.echo(f"✅ User '{username}' registered successfully. Role: {data.get('user', {}).get('role', role or 'client')}")
        else:
            try:
                error = response.json().get('error', response.text)
            except Exception:
                error = response.text
            typer.echo(f"❌ Failed to add user: {error}", err=True)
    except Exception as e:
        typer.echo(f"❌ Error: {e}", err=True)

@users_app.command('del')
def delete_user(username: str):
    """Delete a user by username"""
    session, token = get_session_with_auth()
    if not token:
        typer.echo("❌ Not logged in. Please run 'login' first.", err=True)
        raise typer.Exit(1)
    try:
        response = session.delete(f"{BASE_URL}/users/{username}")
        if response.status_code == 200:
            typer.echo(f"✅ User '{username}' deleted successfully.")
            # If user deleted himself, call logout
            current_username = os.getenv("USER_NAME")
            if current_username and username == current_username:
                typer.echo("You deleted your own account. Logging out...")
                logout()
        else:
            try:
                error = response.json().get('error', response.text)
            except Exception:
                error = response.text
            typer.echo(f"❌ Failed to delete user: {error}", err=True)
    except Exception as e:
        typer.echo(f"❌ Error: {e}", err=True)
