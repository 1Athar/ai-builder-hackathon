import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from orders import OrderManager


@pytest.fixture
def order_manager():
    return OrderManager(phonepe_token="test_token_123")


def test_order_manager_requires_token():
    with pytest.raises(ValueError, match="PHONEPE_TOKEN"):
        OrderManager(phonepe_token="")


def test_order_manager_accepts_valid_token():
    om = OrderManager(phonepe_token="abc123")
    assert om._token == "abc123"


@pytest.mark.asyncio
async def test_create_order_success(order_manager):
    items = [{"name": "Paneer Tikka", "quantity": 2, "price": 250}]
    total = 500

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"transaction_id": "TXN123", "status": "SUCCESS"}

    with patch("orders.httpx.AsyncClient") as mock_client_class:
        mock_client = AsyncMock()
        mock_client.post.return_value = mock_response
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_client_class.return_value = mock_client

        order = await order_manager.create_order(
            items=items,
            total=total,
            customer_name="John",
            phone_number="9876543210",
        )

    assert order["order_id"] == "ORD-1"
    assert order["status"] == "paid"
    assert order["total"] == 500
    assert order["customer_name"] == "John"

    mock_client.post.assert_called_once()
    call_url = mock_client.post.call_args[0][0]
    assert "test_token_123" in call_url


@pytest.mark.asyncio
async def test_create_order_payment_failure(order_manager):
    items = [{"name": "Paneer Tikka", "quantity": 1, "price": 250}]

    mock_response = MagicMock()
    mock_response.status_code = 400
    mock_response.text = "Bad Request"
    mock_response.json.return_value = {"error": "insufficient_funds"}

    with patch("orders.httpx.AsyncClient") as mock_client_class:
        mock_client = AsyncMock()
        mock_client.post.return_value = mock_response
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_client_class.return_value = mock_client

        order = await order_manager.create_order(
            items=items,
            total=250,
            customer_name="John",
            phone_number="9876543210",
        )

    assert order["status"] == "payment_failed"
    assert "error" in order


@pytest.mark.asyncio
async def test_create_order_network_error(order_manager):
    items = [{"name": "Chai", "quantity": 1, "price": 50}]

    with patch("orders.httpx.AsyncClient") as mock_client_class:
        mock_client = AsyncMock()
        mock_client.post.side_effect = Exception("Connection refused")
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_client_class.return_value = mock_client

        order = await order_manager.create_order(
            items=items,
            total=50,
            customer_name="Jane",
            phone_number="1234567890",
        )

    assert order["status"] == "payment_failed"
    assert "Connection refused" in order["error"]


def test_get_order_found(order_manager):
    order_manager._orders["ORD-1"] = {"order_id": "ORD-1", "status": "paid"}
    result = order_manager.get_order("ORD-1")
    assert result is not None
    assert result["status"] == "paid"


def test_get_order_not_found(order_manager):
    result = order_manager.get_order("ORD-999")
    assert result is None


def test_order_ids_increment(order_manager):
    assert order_manager._next_order_id() == "ORD-1"
    assert order_manager._next_order_id() == "ORD-2"
    assert order_manager._next_order_id() == "ORD-3"
