import asyncio
import os
import sys

# Default to the test token so we hit your worker
os.environ["PHONEPE_TOKEN"] = "demo@chromepe"

from server import browse_menu, add_to_cart, view_cart, place_order, check_order_status

async def main():
    print("Welcome to the Food Ordering MCP CLI! 🍔")
    print("Commands:")
    print("  menu                - Browse the menu")
    print("  add <item_id> [qty] - Add item to cart")
    print("  cart                - View cart")
    print("  order               - Place your order")
    print("  exit                - Quit")
    
    while True:
        try:
            cmd = input("\n> ").strip().split()
            if not cmd:
                continue
                
            action = cmd[0].lower()
            
            if action == "exit" or action == "quit":
                break
            elif action == "menu":
                print(await browse_menu())
            elif action == "cart":
                print(await view_cart())
            elif action == "add":
                if len(cmd) < 2:
                    print("Usage: add <item_id> [quantity]")
                    continue
                item_id = cmd[1]
                qty = int(cmd[2]) if len(cmd) > 2 else 1
                print(await add_to_cart(item_id, qty))
            elif action == "order":
                print("\nInitiating order... (This may pause while waiting for approval on your worker)")
                print(await place_order("Soham (CLI)", "9999999999"))
            else:
                print(f"Unknown command: {action}")
                
        except (KeyboardInterrupt, EOFError):
            print("\nExiting...")
            break
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
