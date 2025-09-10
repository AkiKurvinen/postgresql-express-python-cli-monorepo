from typing import Optional
import typer
import os
import requests

users_app = typer.Typer()
from utils import BASE_URL, get_session_with_auth
from utils import logout

# Users command group


@users_app.command("add")
def add_user(username: str, password: str, role: Optional[str] = typer.Argument(None)):
    """Add a new user (register)"""
    session, token = get_session_with_auth()
    payload = {"username": username, "password": password}
    if role:
        payload["role"] = role
    try:
        response = session.put(f"{BASE_URL}/users", json=payload)
        if response.status_code == 201:
            data = response.json()
            typer.echo(
                f"✅ User '{username}' registered successfully. Role: {data.get('user', {}).get('role', role or 'client')}"
            )
        else:
            try:
                error = response.json().get("error", response.text)
            except Exception:
                error = response.text
            typer.echo(f"❌ Failed to add user: {error}", err=True)
    except Exception as e:
        typer.echo(f"❌ Error: {e}", err=True)


@users_app.command("del")
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
                error = response.json().get("error", response.text)
            except Exception:
                error = response.text
            typer.echo(f"❌ Failed to delete user: {error}", err=True)
    except Exception as e:
        typer.echo(f"❌ Error: {e}", err=True)


@users_app.command("all")
def list_all_users():
    """List all users"""
    try:
        response = requests.get(f"{BASE_URL}/users")
        if response.status_code == 200:
            users = response.json()
            if users:
                typer.echo("All users:")
                for user in users:
                    typer.echo(f"- {user['userid']}: {user['username']} (Role: {user['role']})")
            else:
                typer.echo("No users found.")
        else:
            try:
                error = response.json().get('error', response.text)
            except Exception:
                error = response.text
            typer.echo(f"❌ Failed to fetch users: {error}", err=True)
    except Exception as e:
        typer.echo(f"❌ Error: {e}", err=True)
