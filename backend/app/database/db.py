import os
import time
import mysql.connector
from mysql.connector import Error

DB_HOST = os.getenv("DB_HOST") or os.getenv("MYSQL_HOST", "mysql")
DB_USER = os.getenv("DB_USER") or os.getenv("MYSQL_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD") or os.getenv("MYSQL_PASSWORD", "password")
DB_NAME = os.getenv("DB_NAME") or os.getenv("MYSQL_DB", "ecommerce")
DB_CONNECT_RETRIES = int(os.getenv("DB_CONNECT_RETRIES", "10"))
DB_CONNECT_DELAY = int(os.getenv("DB_CONNECT_DELAY", "3"))


def connect_db():
    last_error = None

    for attempt in range(1, DB_CONNECT_RETRIES + 1):
        try:
            return mysql.connector.connect(
                host=DB_HOST,
                user=DB_USER,
                password=DB_PASSWORD,
                database=DB_NAME
            )
        except Error as exc:
            last_error = exc
            print(
                f"Database connection failed (attempt {attempt}/{DB_CONNECT_RETRIES}): {exc}"
            )
            if attempt < DB_CONNECT_RETRIES:
                time.sleep(DB_CONNECT_DELAY)

    raise last_error


db = connect_db()