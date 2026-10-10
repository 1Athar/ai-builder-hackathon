import pytest
from trip_manager import TripManager


@pytest.fixture
def trip():
    return TripManager()


def test_new_trip_is_empty(trip):
    assert trip.is_empty() is True
    assert trip.view() == {}
    assert trip.get_total() == 0


def test_add_valid_option(trip):
    result = trip.add("BUS-1")
    assert result["success"] is True
    assert result["option"]["id"] == "BUS-1"
    assert result["option"]["operator"] == "RedBus Express"


def test_add_invalid_option(trip):
    result = trip.add("INVALID-99")
    assert result["success"] is False
    assert "not found" in result["error"]


def test_add_duplicate_option(trip):
    trip.add("BUS-1")
    result = trip.add("BUS-1")
    assert result["success"] is False
    assert "already" in result["error"]


def test_remove_existing_option(trip):
    trip.add("BUS-1")
    result = trip.remove("BUS-1")
    assert result["success"] is True
    assert trip.is_empty() is True


def test_remove_nonexistent_option(trip):
    result = trip.remove("BUS-1")
    assert result["success"] is False
    assert "not found" in result["error"]


def test_view_returns_trip_state(trip):
    trip.add("BUS-1")
    trip.add("TRN-1")
    contents = trip.view()
    assert "BUS-1" in contents
    assert "TRN-1" in contents


def test_get_total(trip):
    trip.add("BUS-1")   # 800
    trip.add("TRN-1")   # 2500
    assert trip.get_total() == 3300


def test_get_items_snapshot(trip):
    trip.add("BUS-1")
    trip.add("FLT-1")
    items = trip.get_items_snapshot()
    assert len(items) == 2
    assert items[0]["id"] == "BUS-1"
    assert items[0]["price"] == 800
    assert items[1]["id"] == "FLT-1"
    assert items[1]["price"] == 5500


def test_clear(trip):
    trip.add("BUS-1")
    trip.add("TRN-1")
    trip.clear()
    assert trip.is_empty() is True
    assert trip.get_total() == 0


def test_is_empty_after_add(trip):
    assert trip.is_empty() is True
    trip.add("BUS-1")
    assert trip.is_empty() is False
