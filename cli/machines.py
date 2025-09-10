from typing import Optional
import typer
machines_app = typer.Typer()
from utils import BASE_URL, get_session_with_auth

# Machines command group
@machines_app.command('get')
def machines(user_id: int):
    """Get all machines for a user id (authenticated)"""
    session, token = get_session_with_auth()
    if not token:
        typer.echo("❌ Not logged in. Please run 'login' first.", err=True)
        raise typer.Exit(1)
    try:
        url = f"{BASE_URL}/machines/user/{user_id}"
        response = session.get(url)
        if response.status_code == 200:
            machines = response.json()
            if machines:
                typer.echo(f"Machines for user {user_id}:")
                for m in machines:
                    typer.echo(f"- {m['id']}: {m['name']} (Registered: {m['registered_date']})")
            else:
                typer.echo(f"No machines found for user {user_id}.")
        else:
            try:
                error = response.json().get('error', response.text)
            except Exception:
                error = response.text
            typer.echo(f"❌ Failed to fetch machines: {error}", err=True)
    except Exception as e:
        typer.echo(f"❌ Error: {e}", err=True)

@machines_app.command('add')
def add_machine(name: str, user_id: int):
    """Add a new machine for a user"""
    session, token = get_session_with_auth()
    if not token:
        typer.echo("❌ Not logged in. Please run 'login' first.", err=True)
        raise typer.Exit(1)
    payload = {"name": name, "user_id": user_id}
    try:
        response = session.post(f"{BASE_URL}/machines", json=payload)
        if response.status_code == 201:
            machine = response.json().get("machine")
            typer.echo(f"✅ Machine '{name}' added for user {user_id}. ID: {machine.get('id')}")
        else:
            try:
                error = response.json().get('error', response.text)
            except Exception:
                error = response.text
            typer.echo(f"❌ Failed to add machine: {error}", err=True)
    except Exception as e:
        typer.echo(f"❌ Error: {e}", err=True)