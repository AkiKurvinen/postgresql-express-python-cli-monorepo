# PostgreSQL

## Installation
*A. Container & pgAdmin*  
```bash
cd database
docker-compose up -d
npx knex migrate:latest
npx knex seed:run
```

*B. sqlite*
```bash
npm install
npm install sqlite3
npx knex init
npx knex migrate:latest
npx knex seed:run
```
Edit knwxfile.js
```
  development: {
    client: 'sqlite3',
    connection: {
      filename: '../database/dev.sqlite3'
    }
  },
```

## Browse database in SQLite
*A. Use SQLite VS Code extension*
```
Ctrl + Shift + P  
>Explorer: Focus on SQLite Explorer View  
Choose table and click arrow to send SELECT query  
```
*B. Install SQLite from sqlite.org and use command line*

## Browse database in pgAdmin
- Open your browser and go to http://localhost:5050/
- Log in with the default credentials:
  - See email and password in [docker-compose.yml](docker-compose.yml)
- Click "Add New Server".
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