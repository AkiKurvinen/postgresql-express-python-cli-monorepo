# Database

## Installation
*Dcoker Container with pgAdmin*  
```bash
cd database
npm install
docker-compose up -d
npx knex migrate:rollback --all
npx knex migrate:latest
npx knex seed:run
```

## Browse database in pgAdmin
- Open your browser and go to http://localhost:5050/
- Log in with the default credentials:
  - See email and password in [docker-compose.yml](docker-compose.yml)
- Click "Add New Server"
- In the "General" tab, enter a name (e.g., postgres).
- Go to the "Connection" tab and fill in:
  - Host name/address: db
  - Port: 5432
  - Username: postgres
  - Password: postgres
- Click "Save"
- Use Object Explorer to find e.g. users table  
  - mydatabase > Schemas > public > Tables > users > Columns  
- Preview table by selecting Properties tab

*Note: You will see two databases:*

mydatabase: This is the custom database you defined in your Docker Compose file with POSTGRES_DB: mydatabase. It’s meant for your application’s data.

postgres: This is a default database that PostgreSQL always creates for administrative purposes. It’s used internally and for admin tasks.

## SQL queries
```sql
SELECT * FROM users;
DELETE FROM users WHERE username = 'admin'; 
```
