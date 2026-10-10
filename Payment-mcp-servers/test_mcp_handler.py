import asyncio
import os
import sys
# Set up the environment
os.environ["PHONEPE_TOKEN"] = "demo@chromepe"

from server import add_to_cart, place_order

async def main():
    print("Executing MCP tool: add_to_cart...")
    cart_result = await add_to_cart("M1", 1)
    print(f"add_to_cart output: {cart_result}")
    
    print("\nExecuting MCP tool: place_order...")
    order_result = await place_order("Soham", "9999999999")
    print(f"\nplace_order final output:\n{order_result}")

if __name__ == "__main__":
    asyncio.run(main())
