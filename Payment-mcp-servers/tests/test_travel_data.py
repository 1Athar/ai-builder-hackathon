import pytest
from travel_data import (
    BUSES, TRAINS, FLIGHTS,
    search_buses, search_trains, search_flights,
    get_option_by_id,
)


def test_buses_has_entries():
    assert len(BUSES) >= 10


def test_trains_has_entries():
    assert len(TRAINS) >= 10


def test_flights_has_entries():
    assert len(FLIGHTS) >= 10


def test_every_bus_has_required_fields():
    required = {"id", "operator", "from_city", "to_city", "departure", "arrival", "duration", "price", "bus_type"}
    for bus in BUSES:
        assert required.issubset(bus.keys()), f"Bus {bus.get('id')} missing fields"
        assert isinstance(bus["price"], int)
        assert bus["id"].startswith("BUS-")


def test_every_train_has_required_fields():
    required = {"id", "train_name", "train_number", "from_city", "to_city", "departure", "arrival", "duration", "price", "travel_class"}
    for train in TRAINS:
        assert required.issubset(train.keys()), f"Train {train.get('id')} missing fields"
        assert isinstance(train["price"], int)
        assert train["id"].startswith("TRN-")


def test_every_flight_has_required_fields():
    required = {"id", "airline", "flight_number", "from_city", "to_city", "departure", "arrival", "duration", "price", "travel_class"}
    for flight in FLIGHTS:
        assert required.issubset(flight.keys()), f"Flight {flight.get('id')} missing fields"
        assert isinstance(flight["price"], int)
        assert flight["id"].startswith("FLT-")


def test_all_option_ids_unique():
    all_ids = [b["id"] for b in BUSES] + [t["id"] for t in TRAINS] + [f["id"] for f in FLIGHTS]
    assert len(all_ids) == len(set(all_ids)), "Duplicate option IDs found"


def test_search_buses_found():
    results = search_buses("Delhi", "Jaipur")
    assert len(results) >= 1
    for bus in results:
        assert bus["from_city"] == "Delhi"
        assert bus["to_city"] == "Jaipur"


def test_search_buses_case_insensitive():
    results = search_buses("delhi", "jaipur")
    assert len(results) >= 1


def test_search_buses_not_found():
    results = search_buses("Delhi", "London")
    assert results == []


def test_search_trains_found():
    results = search_trains("Delhi", "Mumbai")
    assert len(results) >= 1
    for train in results:
        assert train["from_city"] == "Delhi"
        assert train["to_city"] == "Mumbai"


def test_search_trains_case_insensitive():
    results = search_trains("delhi", "mumbai")
    assert len(results) >= 1


def test_search_trains_not_found():
    results = search_trains("Delhi", "London")
    assert results == []


def test_search_flights_found():
    results = search_flights("Delhi", "Bangalore")
    assert len(results) >= 1
    for flight in results:
        assert flight["from_city"] == "Delhi"
        assert flight["to_city"] == "Bangalore"


def test_search_flights_case_insensitive():
    results = search_flights("delhi", "bangalore")
    assert len(results) >= 1


def test_search_flights_not_found():
    results = search_flights("Delhi", "London")
    assert results == []


def test_get_option_by_id_bus():
    option = get_option_by_id("BUS-1")
    assert option is not None
    assert option["id"] == "BUS-1"


def test_get_option_by_id_train():
    option = get_option_by_id("TRN-1")
    assert option is not None
    assert option["id"] == "TRN-1"


def test_get_option_by_id_flight():
    option = get_option_by_id("FLT-1")
    assert option is not None
    assert option["id"] == "FLT-1"


def test_get_option_by_id_invalid():
    option = get_option_by_id("INVALID-99")
    assert option is None
