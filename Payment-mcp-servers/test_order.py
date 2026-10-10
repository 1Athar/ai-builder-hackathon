import asyncio
from orders import OrderManager
import os
from dotenv import load_dotenv

load_dotenv()

async def main():
    token = os.getenv("PHONEPE_TOKEN", "test_token")
    manager = OrderManager(token)
    items = [{"id": "item-1", "name": "Pizza", "price": 500}]
    order = await manager.create_order(
        items=items,
        total=500,
        customer_name="Test User",
        phone_number="9999999999"
    )
    print("Order Result:")
    import json
    print(json.dumps(order, indent=2))

asyncio.run(main())
