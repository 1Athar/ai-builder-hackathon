from travel_data import get_option_by_id


class TripManager:
    def __init__(self):
        self._items: dict[str, dict] = {}

    def add(self, option_id: str) -> dict:
        if option_id in self._items:
            return {"success": False, "error": f"Option '{option_id}' is already in your trip"}

        option = get_option_by_id(option_id)
        if option is None:
            return {"success": False, "error": f"Option '{option_id}' not found"}

        self._items[option_id] = option
        return {"success": True, "option": option}

    def remove(self, option_id: str) -> dict:
        if option_id not in self._items:
            return {"success": False, "error": f"Option '{option_id}' not found in your trip"}

        removed = self._items.pop(option_id)
        return {"success": True, "option": removed}

    def view(self) -> dict:
        return dict(self._items)

    def get_items_snapshot(self) -> list[dict]:
        return list(self._items.values())

    def get_total(self) -> int:
        return sum(option["price"] for option in self._items.values())

    def clear(self):
        self._items.clear()

    def is_empty(self) -> bool:
        return len(self._items) == 0
