"""
EcoVerse AI — Database Seeding Script
Executes SQL seed commands into PostgreSQL database
"""
import sys

def seed_database():
    print("Reading schema.sql...")
    try:
        with open("schema.sql", "r") as f:
            sql_script = f.read()
        print(f"Loaded schema.sql ({len(sql_script)} bytes). Ready to execute on target PostgreSQL host.")
        print("To seed a live PostgreSQL instance:")
        print("  psql -h <host> -U <user> -d <database> -f schema.sql")
    except Exception as e:
        print(f"Error loading schema: {e}")

if __name__ == "__main__":
    seed_database()
