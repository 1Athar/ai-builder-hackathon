import pytest
from cart import CartManager
from menu import get_item_by_id


@pytest.fixture
def cart():
    return CartManager()


def test_new_cart_is_empty(cart):
    assert cart.view() == {}
    assert cart.get_total() == 0


def test_add_valid_item(cart):
    result = cart.add("S1", 2)
    assert result["success"] is True
    assert result["item_name"] == "Paneer Tikka"
    assert result["quantity"] == 2

    contents = cart.view()
    assert "S1" in contents
    assert contents["S1"]["quantity"] == 2
    assert contents["S1"]["item"]["name"] == "Paneer Tikka"


def test_add_item_increases_quantity(cart):
    cart.add("S1", 1)
    cart.add("S1", 3)
    contents = cart.view()
    assert contents["S1"]["quantity"] == 4


def test_add_invalid_item(cart):
    result = cart.add("INVALID", 1)
    assert result["success"] is False
    assert "not found" in result["error"]


def test_add_zero_quantity(cart):
    result = cart.add("S1", 0)
    assert result["success"] is False
    assert "at least 1" in result["error"]


def test_get_total(cart):
    cart.add("S1", 2)  # 250 * 2 = 500
    cart.add("B1", 1)  # 50 * 1 = 50
    assert cart.get_total() == 550


def test_get_items_snapshot(cart):
    cart.add("S1", 2)
    cart.add("M1", 1)
    items = cart.get_items_snapshot()
    assert len(items) == 2
    assert items[0]["name"] == "Paneer Tikka"
    assert items[0]["quantity"] == 2
    assert items[0]["price"] == 250
    assert items[1]["name"] == "Butter Chicken"


def test_clear(cart):
    cart.add("S1", 1)
    cart.clear()
    assert cart.view() == {}
    assert cart.get_total() == 0


def test_is_empty(cart):
    assert cart.is_empty() is True
    cart.add("S1", 1)
    assert cart.is_empty() is False
