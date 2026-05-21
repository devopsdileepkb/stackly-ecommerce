import os
from dotenv import load_dotenv

# Load .env only in non-production environments
if os.getenv("FLASK_ENV", "development") != "production":
    load_dotenv()


class Config:
    """Base configuration"""
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    DEBUG = FLASK_ENV == "development"
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")


class DevelopmentConfig(Config):
    """Development configuration (local MySQL)"""
    DEBUG = True
    TESTING = False

    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_USER = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "password")
    MYSQL_DB = os.getenv("MYSQL_DB", "ecommerce")
    MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")


class ProductionConfig(Config):
    """Production configuration (AWS RDS)"""
    DEBUG = False
    TESTING = False

    MYSQL_HOST = os.getenv("MYSQL_HOST")
    MYSQL_USER = os.getenv("MYSQL_USER")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
    MYSQL_DB = os.getenv("MYSQL_DB")
    MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True

    MYSQL_HOST = "localhost"
    MYSQL_USER = "test"
    MYSQL_PASSWORD = "test"
    MYSQL_DB = "ecommerce_test"
    MYSQL_PORT = "3306"


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
    "default": DevelopmentConfig
}