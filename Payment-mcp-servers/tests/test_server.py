import pytest
from unittest.mock import patch, AsyncMock, MagicMock

# We need to mock dotenv before importing server, since server loads env at import
with patch.dict("os.environ", {"PHONEPE_TOKEN": "test_token"}):
    from server import mcp, cart, order_manager


def test_server_name():
    assert mcp.name == "food-ordering"


@pytest.mark.asyncio
async def test_browse_menu_all():
    from server import browse_menu
    result = await browse_menu(category=None)
    assert "Starters" in result
    assert "Main Course" in result
    assert "Beverages" in result


@pytest.mark.asyncio
async def test_browse_menu_single_category():
    from server import browse_menu
    result = await browse_menu(category="Starters")
    assert "Starters" in result
    assert "Main Course" not in result


@pytest.mark.asyncio
async def test_browse_menu_invalid_category():
    from server import browse_menu
    result = await browse_menu(category="Desserts")
    assert "not found" in result.lower()


@pytest.mark.asyncio
async def test_add_to_cart_valid():
    from server import add_to_cart
    cart.clear()
    result = await add_to_cart(item_id="S1", quantity=2)
    assert "Paneer Tikka" in result
    assert "2" in result


@pytest.mark.asyncio
async def test_add_to_cart_invalid():
    from server import add_to_cart
    result = await add_to_cart(item_id="INVALID", quantity=1)
    assert "not found" in result.lower()


@pytest.mark.asyncio
async def test_view_cart_empty():
    from server import view_cart
    cart.clear()
    result = await view_cart()
    assert "empty" in result.lower()


@pytest.mark.asyncio
async def test_view_cart_with_items():
    from server import view_cart
    cart.clear()
    cart.add("S1", 1)
    cart.add("B1", 2)
    result = await view_cart()
    assert "Paneer Tikka" in result
    assert "Masala Chai" in result


@pytest.mark.asyncio
async def test_place_order_empty_cart():
    from server import place_order
    cart.clear()
    result = await place_order(customer_name="Test", phone_number="1234567890")
    assert "empty" in result.lower()


@pytest.mark.asyncio
async def test_place_order_success():
    from server import place_order
    cart.clear()
    cart.add("S1", 1)

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"transaction_id": "TXN1", "status": "SUCCESS"}

    with patch("orders.httpx.AsyncClient") as mock_client_class:
        mock_client = AsyncMock()
        mock_client.post.return_value = mock_response
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_client_class.return_value = mock_client

        result = await place_order(customer_name="John", phone_number="9876543210")

    assert "ORD-" in result
    assert "paid" in result.lower() or "success" in result.lower()


@pytest.mark.asyncio
async def test_check_order_status_not_found():
    from server import check_order_status
    result = await check_order_status(order_id="ORD-999")
    assert "not found" in result.lower()
