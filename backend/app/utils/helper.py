import uuid
from datetime import datetime

def generate_order_id():
    """Generate a unique order ID"""
    return str(uuid.uuid4())

def get_current_timestamp():
    """Get current timestamp"""
    return datetime.now().isoformat()

def validate_email(email):
    """Validate email format"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def format_currency(amount):
    """Format amount as currency"""
    return f"${amount:.2f}"

def calculate_total(items):
    """Calculate total from items"""
    return sum(item.get('price', 0) * item.get('quantity', 1) for item in items)
