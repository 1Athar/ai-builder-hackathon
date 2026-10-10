import pytest
from unittest.mock import patch, AsyncMock, MagicMock

with patch.dict("os.environ", {"PHONEPE_TOKEN": "test_token"}):
    from travel_server import mcp, trip, booking_manager


def test_server_name():
    assert mcp.name == "travel-booking"


@pytest.mark.asyncio
async def test_search_buses_found():
    from travel_server import search_buses
    result = await search_buses(from_city="Delhi", to_city="Jaipur")
    assert "BUS-1" in result
    assert "RedBus Express" in result


@pytest.mark.asyncio
async def test_search_buses_not_found():
    from travel_server import search_buses
    result = await search_buses(from_city="Delhi", to_city="London")
    assert "no buses found" in result.lower()


@pytest.mark.asyncio
async def test_search_trains_found():
    from travel_server import search_trains
    result = await search_trains(from_city="Delhi", to_city="Mumbai")
    assert "TRN-1" in result
    assert "Rajdhani" in result


@pytest.mark.asyncio
async def test_search_trains_not_found():
    from travel_server import search_trains
    result = await search_trains(from_city="Delhi", to_city="London")
    assert "no trains found" in result.lower()


@pytest.mark.asyncio
async def test_search_flights_found():
    from travel_server import search_flights
    result = await search_flights(from_city="Delhi", to_city="Bangalore")
    assert "FLT-1" in result
    assert "IndiGo" in result


@pytest.mark.asyncio
async def test_search_flights_not_found():
    from travel_server import search_flights
    result = await search_flights(from_city="Delhi", to_city="London")
    assert "no flights found" in result.lower()


@pytest.mark.asyncio
async def test_add_to_trip_valid():
    from travel_server import add_to_trip
    trip.clear()
    result = await add_to_trip(option_id="BUS-1")
    assert "added" in result.lower()
    assert "RedBus Express" in result


@pytest.mark.asyncio
async def test_add_to_trip_invalid():
    from travel_server import add_to_trip
    result = await add_to_trip(option_id="INVALID-99")
    assert "not found" in result.lower()


@pytest.mark.asyncio
async def test_view_trip_empty():
    from travel_server import view_trip
    trip.clear()
    result = await view_trip()
    assert "empty" in result.lower()


@pytest.mark.asyncio
async def test_view_trip_with_items():
    from travel_server import view_trip
    trip.clear()
    trip.add("BUS-1")
    trip.add("FLT-1")
    result = await view_trip()
    assert "RedBus Express" in result
    assert "IndiGo" in result


@pytest.mark.asyncio
async def test_book_trip_item_success():
    from travel_server import book_trip_item
    trip.clear()
    trip.add("BUS-1")

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"transaction_id": "TXN1", "status": "SUCCESS"}

    with patch("travel_bookings.httpx.AsyncClient") as mock_client_class:
        mock_client = AsyncMock()
        mock_client.post.return_value = mock_response
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_client_class.return_value = mock_client

        result = await book_trip_item(
            option_id="BUS-1",
            passenger_name="Soham",
            phone_number="9876543210",
        )

    assert "TRV-" in result
    assert "paid" in result.lower() or "success" in result.lower()


@pytest.mark.asyncio
async def test_book_trip_item_not_in_trip():
    from travel_server import book_trip_item
    trip.clear()
    result = await book_trip_item(
        option_id="BUS-1",
        passenger_name="Soham",
        phone_number="9876543210",
    )
    assert "not found" in result.lower() or "not in" in result.lower()


@pytest.mark.asyncio
async def test_check_booking_status_not_found():
    from travel_server import check_booking_status
    result = await check_booking_status(booking_id="TRV-999")
    assert "not found" in result.lower()
