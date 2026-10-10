MENU: dict[str, list[dict]] = {
    "Starters": [
        {"id": "S1", "name": "Paneer Tikka", "price": 250},
        {"id": "S2", "name": "Chicken Wings", "price": 300},
        {"id": "S3", "name": "Veg Spring Rolls", "price": 180},
    ],
    "Main Course": [
        {"id": "M1", "name": "Butter Chicken", "price": 350},
        {"id": "M2", "name": "Paneer Butter Masala", "price": 300},
        {"id": "M3", "name": "Biryani", "price": 280},
    ],
    "Beverages": [
        {"id": "B1", "name": "Masala Chai", "price": 50},
        {"id": "B2", "name": "Cold Coffee", "price": 120},
        {"id": "B3", "name": "Fresh Lime Soda", "price": 80},
    ],
}


def get_all_items() -> dict[str, list[dict]]:
    return MENU


def get_items_by_category(category: str) -> list[dict] | None:
    return MENU.get(category)


def get_item_by_id(item_id: str) -> dict | None:
    for items in MENU.values():
        for item in items:
            if item["id"] == item_id:
                return item
    return None
