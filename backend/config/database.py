import os
import mysql.connector
from mysql.connector import pooling
from dotenv import load_dotenv

load_dotenv()

db_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="sih_pool",
    pool_size=5,
    host=os.getenv("DB_HOST", "127.0.0.1"),
    user=os.getenv("DB_USER", "root"),
    password=os.getenv("DB_PASSWORD", ""),
    database=os.getenv("DB_NAME", "jharkhand_sih_db"),
    port=int(os.getenv("DB_PORT", 3306))
)

def get_db_connection():
    """Retrieves a thread-safe connection from the pool."""
    return db_pool.get_connection()