import os
import time
import mysql.connector
from mysql.connector import Error

# =========================
# RDS CONFIG (ONLY ENV VARS)
# =========================
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASS")
DB_NAME = os.getenv("DB_NAME")

DB_PORT = int(os.getenv("DB_PORT", "3306"))

DB_CONNECT_RETRIES = int(os.getenv("DB_CONNECT_RETRIES", "10"))
DB_CONNECT_DELAY = int(os.getenv("DB_CONNECT_DELAY", "3"))


def connect_db():
    if not DB_HOST:
        raise Exception("DB_HOST is not set. Please configure AWS RDS endpoint.")

    last_error = None

    for attempt in range(1, DB_CONNECT_RETRIES + 1):
        try:
            return mysql.connector.connect(
                host=DB_HOST,
                user=DB_USER,
                password=DB_PASSWORD,
                database=DB_NAME,
                port=DB_PORT
            )

        except Error as exc:
            last_error = exc
            print(f"[DB] Connection failed ({attempt}/{DB_CONNECT_RETRIES}): {exc}")

            if attempt < DB_CONNECT_RETRIES:
                time.sleep(DB_CONNECT_DELAY)

    raise last_error


db = connect_db()