import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from travel_bookings import BookingManager


@pytest.fixture
def booking_manager():
    return BookingManager(phonepe_token="test_token_123")


def test_booking_manager_requires_token():
    with pytest.raises(ValueError, match="PHONEPE_TOKEN"):
        BookingManager(phonepe_token="")


def test_booking_manager_accepts_valid_token():
    bm = BookingManager(phonepe_token="abc123")
    assert bm._token == "abc123"


def test_booking_ids_increment(booking_manager):
    assert booking_manager._next_booking_id() == "TRV-1"
    assert booking_manager._next_booking_id() == "TRV-2"
    assert booking_manager._next_booking_id() == "TRV-3"


@pytest.mark.asyncio
async def test_book_success(booking_manager):
    option = {
        "id": "BUS-1",
        "operator": "RedBus Express",
        "from_city": "Delhi",
        "to_city": "Jaipur",
        "price": 800,
    }

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"transaction_id": "TXN123", "status": "SUCCESS"}

    with patch("travel_bookings.httpx.AsyncClient") as mock_client_class:
        mock_client = AsyncMock()
        mock_client.post.return_value = mock_response
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_client_class.return_value = mock_client

        booking = await booking_manager.book(
            option=option,
            passenger_name="Soham",
            phone_number="9876543210",
        )

    assert booking["booking_id"] == "TRV-1"
    assert booking["status"] == "paid"
    assert booking["option"]["id"] == "BUS-1"
    assert booking["passenger_name"] == "Soham"
    assert booking["transport_type"] == "bus"

    mock_client.post.assert_called_once()
    call_url = mock_client.post.call_args[0][0]
    assert "test_token_123" in call_url


@pytest.mark.asyncio
async def test_book_payment_failure(booking_manager):
    option = {"id": "TRN-1", "train_name": "Rajdhani", "price": 2500}

    mock_response = MagicMock()
    mock_response.status_code = 400
    mock_response.text = "Bad Request"
    mock_response.json.return_value = {"error": "insufficient_funds"}

    with patch("travel_bookings.httpx.AsyncClient") as mock_client_class:
        mock_client = AsyncMock()
        mock_client.post.return_value = mock_response
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_client_class.return_value = mock_client

        booking = await booking_manager.book(
            option=option,
            passenger_name="Soham",
            phone_number="9876543210",
        )

    assert booking["status"] == "payment_failed"
    assert "error" in booking


@pytest.mark.asyncio
async def test_book_network_error(booking_manager):
    option = {"id": "FLT-1", "airline": "IndiGo", "price": 5500}

    with patch("travel_bookings.httpx.AsyncClient") as mock_client_class:
        mock_client = AsyncMock()
        mock_client.post.side_effect = Exception("Connection refused")
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_client_class.return_value = mock_client

        booking = await booking_manager.book(
            option=option,
            passenger_name="Soham",
            phone_number="1234567890",
        )

    assert booking["status"] == "payment_failed"
    assert "Connection refused" in booking["error"]


def test_get_booking_found(booking_manager):
    booking_manager._bookings["TRV-1"] = {"booking_id": "TRV-1", "status": "paid"}
    result = booking_manager.get_booking("TRV-1")
    assert result is not None
    assert result["status"] == "paid"


def test_get_booking_not_found(booking_manager):
    result = booking_manager.get_booking("TRV-999")
    assert result is None


def test_transport_type_from_bus_id(booking_manager):
    assert booking_manager._get_transport_type("BUS-1") == "bus"


def test_transport_type_from_train_id(booking_manager):
    assert booking_manager._get_transport_type("TRN-5") == "train"


def test_transport_type_from_flight_id(booking_manager):
    assert booking_manager._get_transport_type("FLT-3") == "flight"


def test_transport_type_from_unknown_id(booking_manager):
    assert booking_manager._get_transport_type("XYZ-1") == "unknown"
