from menu import MENU, get_all_items, get_items_by_category, get_item_by_id


def test_menu_has_three_categories():
    assert set(MENU.keys()) == {"Starters", "Main Course", "Beverages"}


def test_each_category_has_items():
    for category, items in MENU.items():
        assert len(items) > 0, f"{category} has no items"


def test_every_item_has_required_fields():
    for category, items in MENU.items():
        for item in items:
            assert "id" in item, f"Missing 'id' in {category}"
            assert "name" in item, f"Missing 'name' in {category}"
            assert "price" in item, f"Missing 'price' in {category}"
            assert isinstance(item["price"], (int, float))


def test_all_item_ids_unique():
    all_ids = [item["id"] for items in MENU.values() for item in items]
    assert len(all_ids) == len(set(all_ids)), "Duplicate item IDs found"


def test_get_all_items_returns_full_menu():
    result = get_all_items()
    assert isinstance(result, dict)
    assert "Starters" in result


def test_get_items_by_category_valid():
    result = get_items_by_category("Starters")
    assert isinstance(result, list)
    assert len(result) > 0
    assert result[0]["id"] == "S1"


def test_get_items_by_category_invalid():
    result = get_items_by_category("Desserts")
    assert result is None


def test_get_item_by_id_valid():
    item = get_item_by_id("S1")
    assert item is not None
    assert item["name"] == "Paneer Tikka"
    assert item["price"] == 250


def test_get_item_by_id_invalid():
    item = get_item_by_id("INVALID")
    assert item is None
