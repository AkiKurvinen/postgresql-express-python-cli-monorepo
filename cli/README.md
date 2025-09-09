# Python CLI App

## Installation

**Create and Activate Virtual Environment**

A. *Windows (Git Bash)*
```bash
cd cli
python -m venv .venv
source .venv/Scripts/activate
```

B. *Windows (cmd or PowerShell)*
```bash
cd cli
python -m venv .venv
.venv\Scripts\activate
```

**Install Dependencies**
```bash
pip install -r requirements.txt
```

**Set environment variables**  
Create .env file based on env-template 

## Run Application
```bash
python main.py status
python main.py login
python main.py profile
python main.py users add "anyusername" "anyuserpassword"
python main.py users add "otherusername" "otheruserpassword" "admin"
python main.py users del "anyusername"
python main.py users del "otherusername"
python main.py logout
```
