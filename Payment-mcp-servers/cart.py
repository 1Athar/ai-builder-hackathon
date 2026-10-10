from menu import get_item_by_id


class CartManager:
    def __init__(self):
        self._items: dict[str, dict] = {}

    def add(self, item_id: str, quantity: int = 1) -> dict:
        if quantity < 1:
            return {"success": False, "error": "Quantity must be at least 1"}

        item = get_item_by_id(item_id)
        if item is None:
            return {"success": False, "error": f"Item '{item_id}' not found in menu"}

        if item_id in self._items:
            self._items[item_id]["quantity"] += quantity
        else:
            self._items[item_id] = {"item": item, "quantity": quantity}

        return {
            "success": True,
            "item_name": item["name"],
            "quantity": self._items[item_id]["quantity"],
        }

    def view(self) -> dict:
        return dict(self._items)

    def get_total(self) -> int:
        return sum(
            entry["item"]["price"] * entry["quantity"]
            for entry in self._items.values()
        )

    def get_items_snapshot(self) -> list[dict]:
        return [
            {
                "name": entry["item"]["name"],
                "quantity": entry["quantity"],
                "price": entry["item"]["price"],
            }
            for entry in self._items.values()
        ]

    def clear(self):
        self._items.clear()

    def is_empty(self) -> bool:
        return len(self._items) == 0
