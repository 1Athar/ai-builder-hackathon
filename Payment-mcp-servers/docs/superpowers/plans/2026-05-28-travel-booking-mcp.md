# Travel Booking MCP Server Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a separate MCP server for travel booking (buses, trains, flights) with static Indian city data, trip planning, and PhonePe payment integration.

**Architecture:** Four modules — `travel_data.py` (static mock data + search), `trip_manager.py` (trip plan state), `travel_bookings.py` (booking + payment), `travel_server.py` (FastMCP with 7 tools). Mirrors the existing food-ordering server pattern exactly.

**Tech Stack:** Python 3.12+, FastMCP, httpx, pytest, pytest-asyncio

---

### Task 1: Travel Data Module

**Files:**
- Create: `travel_data.py`
- Create: `tests/test_travel_data.py`

- [ ] **Step 1: Write the failing tests for travel data**

Create `tests/test_travel_data.py`:

```python
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pytest tests/test_travel_data.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'travel_data'`

- [ ] **Step 3: Implement travel_data.py**

Create `travel_data.py`:

```python
BUSES: list[dict] = [
    {"id": "BUS-1", "operator": "RedBus Express", "from_city": "Delhi", "to_city": "Jaipur", "departure": "06:00", "arrival": "12:00", "duration": "6h", "price": 800, "bus_type": "AC Sleeper"},
    {"id": "BUS-2", "operator": "VRL Travels", "from_city": "Mumbai", "to_city": "Pune", "departure": "07:00", "arrival": "11:00", "duration": "4h", "price": 500, "bus_type": "AC Seater"},
    {"id": "BUS-3", "operator": "SRS Travels", "from_city": "Bangalore", "to_city": "Chennai", "departure": "22:00", "arrival": "05:00", "duration": "7h", "price": 900, "bus_type": "AC Sleeper"},
    {"id": "BUS-4", "operator": "APSRTC", "from_city": "Hyderabad", "to_city": "Bangalore", "departure": "20:00", "arrival": "06:00", "duration": "10h", "price": 1100, "bus_type": "Non-AC Sleeper"},
    {"id": "BUS-5", "operator": "RSRTC", "from_city": "Jaipur", "to_city": "Delhi", "departure": "08:00", "arrival": "14:00", "duration": "6h", "price": 750, "bus_type": "AC Seater"},
    {"id": "BUS-6", "operator": "Neeta Travels", "from_city": "Mumbai", "to_city": "Bangalore", "departure": "18:00", "arrival": "08:00", "duration": "14h", "price": 1500, "bus_type": "AC Sleeper"},
    {"id": "BUS-7", "operator": "Orange Travels", "from_city": "Hyderabad", "to_city": "Chennai", "departure": "21:00", "arrival": "06:00", "duration": "9h", "price": 850, "bus_type": "AC Seater"},
    {"id": "BUS-8", "operator": "Shrinath Travels", "from_city": "Pune", "to_city": "Mumbai", "departure": "09:00", "arrival": "13:00", "duration": "4h", "price": 450, "bus_type": "Non-AC Seater"},
    {"id": "BUS-9", "operator": "KSRTC", "from_city": "Bangalore", "to_city": "Hyderabad", "departure": "19:00", "arrival": "05:00", "duration": "10h", "price": 1000, "bus_type": "AC Sleeper"},
    {"id": "BUS-10", "operator": "Delhi Transport", "from_city": "Delhi", "to_city": "Jaipur", "departure": "14:00", "arrival": "20:00", "duration": "6h", "price": 650, "bus_type": "Non-AC Seater"},
]

TRAINS: list[dict] = [
    {"id": "TRN-1", "train_name": "Rajdhani Express", "train_number": "12951", "from_city": "Delhi", "to_city": "Mumbai", "departure": "16:00", "arrival": "08:00", "duration": "16h", "price": 2500, "travel_class": "AC 2-Tier"},
    {"id": "TRN-2", "train_name": "Shatabdi Express", "train_number": "12002", "from_city": "Delhi", "to_city": "Jaipur", "departure": "06:00", "arrival": "10:30", "duration": "4h 30m", "price": 900, "travel_class": "AC Chair Car"},
    {"id": "TRN-3", "train_name": "Duronto Express", "train_number": "12213", "from_city": "Mumbai", "to_city": "Bangalore", "departure": "20:00", "arrival": "16:00", "duration": "20h", "price": 1800, "travel_class": "AC 3-Tier"},
    {"id": "TRN-4", "train_name": "Coromandel Express", "train_number": "12841", "from_city": "Chennai", "to_city": "Kolkata", "departure": "08:45", "arrival": "10:30", "duration": "26h", "price": 1200, "travel_class": "Sleeper"},
    {"id": "TRN-5", "train_name": "Deccan Queen", "train_number": "12124", "from_city": "Mumbai", "to_city": "Pune", "departure": "07:15", "arrival": "10:30", "duration": "3h 15m", "price": 350, "travel_class": "AC Chair Car"},
    {"id": "TRN-6", "train_name": "Telangana Express", "train_number": "12723", "from_city": "Delhi", "to_city": "Hyderabad", "departure": "06:50", "arrival": "05:30", "duration": "22h 40m", "price": 1600, "travel_class": "AC 3-Tier"},
    {"id": "TRN-7", "train_name": "Mysore Express", "train_number": "12614", "from_city": "Chennai", "to_city": "Bangalore", "departure": "22:00", "arrival": "04:30", "duration": "6h 30m", "price": 500, "travel_class": "Sleeper"},
    {"id": "TRN-8", "train_name": "Garib Rath", "train_number": "12203", "from_city": "Mumbai", "to_city": "Delhi", "departure": "12:00", "arrival": "06:00", "duration": "18h", "price": 1100, "travel_class": "AC 3-Tier"},
    {"id": "TRN-9", "train_name": "Howrah Rajdhani", "train_number": "12301", "from_city": "Delhi", "to_city": "Kolkata", "departure": "17:00", "arrival": "10:00", "duration": "17h", "price": 2800, "travel_class": "AC 2-Tier"},
    {"id": "TRN-10", "train_name": "Bangalore Rajdhani", "train_number": "22691", "from_city": "Delhi", "to_city": "Bangalore", "departure": "20:50", "arrival": "06:40", "duration": "34h", "price": 3200, "travel_class": "AC 2-Tier"},
]

FLIGHTS: list[dict] = [
    {"id": "FLT-1", "airline": "IndiGo", "flight_number": "6E-2001", "from_city": "Delhi", "to_city": "Bangalore", "departure": "08:00", "arrival": "11:00", "duration": "3h", "price": 5500, "travel_class": "Economy"},
    {"id": "FLT-2", "airline": "Air India", "flight_number": "AI-505", "from_city": "Delhi", "to_city": "Mumbai", "departure": "06:30", "arrival": "08:30", "duration": "2h", "price": 6000, "travel_class": "Economy"},
    {"id": "FLT-3", "airline": "SpiceJet", "flight_number": "SG-8169", "from_city": "Mumbai", "to_city": "Chennai", "departure": "10:00", "arrival": "12:00", "duration": "2h", "price": 4800, "travel_class": "Economy"},
    {"id": "FLT-4", "airline": "Vistara", "flight_number": "UK-835", "from_city": "Bangalore", "to_city": "Delhi", "departure": "14:00", "arrival": "17:00", "duration": "3h", "price": 7500, "travel_class": "Business"},
    {"id": "FLT-5", "airline": "IndiGo", "flight_number": "6E-6042", "from_city": "Kolkata", "to_city": "Delhi", "departure": "09:00", "arrival": "11:30", "duration": "2h 30m", "price": 5000, "travel_class": "Economy"},
    {"id": "FLT-6", "airline": "Air India", "flight_number": "AI-671", "from_city": "Chennai", "to_city": "Hyderabad", "departure": "15:00", "arrival": "16:30", "duration": "1h 30m", "price": 3500, "travel_class": "Economy"},
    {"id": "FLT-7", "airline": "Vistara", "flight_number": "UK-727", "from_city": "Mumbai", "to_city": "Bangalore", "departure": "11:00", "arrival": "12:30", "duration": "1h 30m", "price": 4500, "travel_class": "Economy"},
    {"id": "FLT-8", "airline": "SpiceJet", "flight_number": "SG-2965", "from_city": "Hyderabad", "to_city": "Mumbai", "departure": "07:00", "arrival": "08:30", "duration": "1h 30m", "price": 3800, "travel_class": "Economy"},
    {"id": "FLT-9", "airline": "IndiGo", "flight_number": "6E-5312", "from_city": "Delhi", "to_city": "Kolkata", "departure": "16:00", "arrival": "18:30", "duration": "2h 30m", "price": 5200, "travel_class": "Economy"},
    {"id": "FLT-10", "airline": "Air India", "flight_number": "AI-865", "from_city": "Pune", "to_city": "Delhi", "departure": "19:00", "arrival": "21:15", "duration": "2h 15m", "price": 6500, "travel_class": "Business"},
]


def search_buses(from_city: str, to_city: str) -> list[dict]:
    from_lower = from_city.lower()
    to_lower = to_city.lower()
    return [
        bus for bus in BUSES
        if bus["from_city"].lower() == from_lower
        and bus["to_city"].lower() == to_lower
    ]


def search_trains(from_city: str, to_city: str) -> list[dict]:
    from_lower = from_city.lower()
    to_lower = to_city.lower()
    return [
        train for train in TRAINS
        if train["from_city"].lower() == from_lower
        and train["to_city"].lower() == to_lower
    ]


def search_flights(from_city: str, to_city: str) -> list[dict]:
    from_lower = from_city.lower()
    to_lower = to_city.lower()
    return [
        flight for flight in FLIGHTS
        if flight["from_city"].lower() == from_lower
        and flight["to_city"].lower() == to_lower
    ]


def get_option_by_id(option_id: str) -> dict | None:
    lookup: dict[str, list[dict]] = {
        "BUS": BUSES,
        "TRN": TRAINS,
        "FLT": FLIGHTS,
    }
    prefix = option_id.split("-")[0] if "-" in option_id else ""
    options = lookup.get(prefix, [])
    for option in options:
        if option["id"] == option_id:
            return option
    return None
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pytest tests/test_travel_data.py -v`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add travel_data.py tests/test_travel_data.py
git commit -m "feat: add travel data module with bus, train, flight schedules"
```

---

### Task 2: Trip Manager Module

**Files:**
- Create: `trip_manager.py`
- Create: `tests/test_trip_manager.py`

- [ ] **Step 1: Write the failing tests for trip manager**

Create `tests/test_trip_manager.py`:

```python
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pytest tests/test_trip_manager.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'trip_manager'`

- [ ] **Step 3: Implement trip_manager.py**

Create `trip_manager.py`:

```python
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pytest tests/test_trip_manager.py -v`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add trip_manager.py tests/test_trip_manager.py
git commit -m "feat: add trip manager module with add, remove, view, clear"
```

---

### Task 3: Travel Bookings Module

**Files:**
- Create: `travel_bookings.py`
- Create: `tests/test_travel_bookings.py`

- [ ] **Step 1: Write the failing tests for travel bookings**

Create `tests/test_travel_bookings.py`:

```python
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pytest tests/test_travel_bookings.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'travel_bookings'`

- [ ] **Step 3: Implement travel_bookings.py**

Create `travel_bookings.py`:

```python
from datetime import datetime, timezone

import httpx

PHONEPE_BASE_URL = "https://api.phonepe.com"


class BookingManager:
    def __init__(self, phonepe_token: str):
        if not phonepe_token:
            raise ValueError("PHONEPE_TOKEN is required but was empty")
        self._token = phonepe_token
        self._bookings: dict[str, dict] = {}
        self._counter = 0

    def _next_booking_id(self) -> str:
        self._counter += 1
        return f"TRV-{self._counter}"

    @staticmethod
    def _get_transport_type(option_id: str) -> str:
        prefix_map = {"BUS": "bus", "TRN": "train", "FLT": "flight"}
        prefix = option_id.split("-")[0] if "-" in option_id else ""
        return prefix_map.get(prefix, "unknown")

    async def book(
        self,
        option: dict,
        passenger_name: str,
        phone_number: str,
    ) -> dict:
        booking_id = self._next_booking_id()
        booking = {
            "booking_id": booking_id,
            "transport_type": self._get_transport_type(option["id"]),
            "option": option,
            "passenger_name": passenger_name,
            "phone_number": phone_number,
            "status": "pending",
            "payment_response": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        url = f"{PHONEPE_BASE_URL}/phonepe/pay/{self._token}"
        payload = {
            "booking_id": booking_id,
            "amount": option["price"],
            "passenger_name": passenger_name,
            "phone_number": phone_number,
            "option": option,
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload)

            if response.status_code >= 200 and response.status_code < 300:
                booking["status"] = "paid"
                booking["payment_response"] = response.json()
            else:
                booking["status"] = "payment_failed"
                booking["error"] = f"Payment failed (HTTP {response.status_code}): {response.text}"
                booking["payment_response"] = response.json()
        except Exception as e:
            booking["status"] = "payment_failed"
            booking["error"] = str(e)

        self._bookings[booking_id] = booking
        return booking

    def get_booking(self, booking_id: str) -> dict | None:
        return self._bookings.get(booking_id)
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pytest tests/test_travel_bookings.py -v`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add travel_bookings.py tests/test_travel_bookings.py
git commit -m "feat: add travel bookings module with PhonePe payment"
```

---

### Task 4: Travel MCP Server

**Files:**
- Create: `travel_server.py`
- Create: `tests/test_travel_server.py`

- [ ] **Step 1: Write the failing tests for the travel server**

Create `tests/test_travel_server.py`:

```python
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pytest tests/test_travel_server.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'travel_server'`

- [ ] **Step 3: Implement travel_server.py**

Create `travel_server.py`:

```python
import json
import os

from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP

from travel_data import search_buses as _search_buses
from travel_data import search_trains as _search_trains
from travel_data import search_flights as _search_flights
from travel_data import get_option_by_id
from trip_manager import TripManager
from travel_bookings import BookingManager

load_dotenv()

phonepe_token = os.getenv("PHONEPE_TOKEN", "")
if not phonepe_token:
    raise RuntimeError(
        "PHONEPE_TOKEN environment variable is required. "
        "Set it in your .env file."
    )

mcp = FastMCP("travel-booking")
trip = TripManager()
booking_manager = BookingManager(phonepe_token=phonepe_token)


@mcp.tool()
async def search_buses(from_city: str, to_city: str) -> str:
    """Search available buses between two Indian cities."""
    results = _search_buses(from_city, to_city)
    if not results:
        return f"No buses found from {from_city} to {to_city}."
    return json.dumps(results, indent=2)


@mcp.tool()
async def search_trains(from_city: str, to_city: str) -> str:
    """Search available trains between two Indian cities."""
    results = _search_trains(from_city, to_city)
    if not results:
        return f"No trains found from {from_city} to {to_city}."
    return json.dumps(results, indent=2)


@mcp.tool()
async def search_flights(from_city: str, to_city: str) -> str:
    """Search available flights between two Indian cities."""
    results = _search_flights(from_city, to_city)
    if not results:
        return f"No flights found from {from_city} to {to_city}."
    return json.dumps(results, indent=2)


@mcp.tool()
async def add_to_trip(option_id: str) -> str:
    """Add a bus, train, or flight to your trip plan by its ID (e.g. BUS-1, TRN-3, FLT-5)."""
    result = trip.add(option_id)
    if not result["success"]:
        return f"Error: {result['error']}"

    option = result["option"]
    total = trip.get_total()
    return (
        f"Added {option.get('operator') or option.get('train_name') or option.get('airline')} "
        f"({option['from_city']} → {option['to_city']}) to your trip. "
        f"Trip total: ₹{total}"
    )


@mcp.tool()
async def view_trip() -> str:
    """View the current trip plan with all selected transport options and total cost."""
    if trip.is_empty():
        return "Your trip plan is empty. Search for buses, trains, or flights to get started."

    items = trip.get_items_snapshot()
    lines = ["🗺️ Your Trip Plan:", ""]
    for item in items:
        label = item.get("operator") or item.get("train_name") or item.get("airline")
        lines.append(
            f"  • [{item['id']}] {label} — {item['from_city']} → {item['to_city']} "
            f"| {item['departure']} → {item['arrival']} ({item['duration']}) — ₹{item['price']}"
        )

    lines.append(f"\n  Total: ₹{trip.get_total()}")
    return "\n".join(lines)


@mcp.tool()
async def book_trip_item(option_id: str, passenger_name: str, phone_number: str) -> str:
    """Book and pay for a specific item in your trip plan. Processes payment via PhonePe."""
    option = get_option_by_id(option_id)
    if option is None:
        return f"Error: Option '{option_id}' not found."

    trip_items = trip.view()
    if option_id not in trip_items:
        return f"Error: Option '{option_id}' is not in your trip plan. Add it first."

    booking = await booking_manager.book(
        option=option,
        passenger_name=passenger_name,
        phone_number=phone_number,
    )

    if booking["status"] == "paid":
        trip.remove(option_id)
        return (
            f"✅ Booking confirmed!\n"
            f"  Booking ID: {booking['booking_id']}\n"
            f"  Type: {booking['transport_type'].title()}\n"
            f"  Route: {option['from_city']} → {option['to_city']}\n"
            f"  Amount: ₹{option['price']}\n"
            f"  Status: {booking['status']}\n"
            f"  Payment: {json.dumps(booking.get('payment_response', {}))}"
        )
    else:
        return (
            f"❌ Payment failed for booking {booking['booking_id']}.\n"
            f"  Error: {booking.get('error', 'Unknown error')}\n"
            f"  The item remains in your trip plan. Try again."
        )


@mcp.tool()
async def check_booking_status(booking_id: str) -> str:
    """Check the status of a travel booking by its ID (e.g. TRV-1)."""
    booking = booking_manager.get_booking(booking_id)
    if booking is None:
        return f"Booking '{booking_id}' not found."

    option = booking["option"]
    label = option.get("operator") or option.get("train_name") or option.get("airline")
    lines = [
        f"🎫 Booking {booking['booking_id']}:",
        f"  Type: {booking['transport_type'].title()}",
        f"  Service: {label}",
        f"  Route: {option['from_city']} → {option['to_city']}",
        f"  Passenger: {booking['passenger_name']}",
        f"  Phone: {booking['phone_number']}",
        f"  Status: {booking['status']}",
        f"  Amount: ₹{option['price']}",
        f"  Booked at: {booking['created_at']}",
    ]
    return "\n".join(lines)


if __name__ == "__main__":
    mcp.run()
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pytest tests/test_travel_server.py -v`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add travel_server.py tests/test_travel_server.py
git commit -m "feat: add travel booking MCP server with 7 tools"
```

---

### Task 5: Configuration and Final Verification

**Files:**
- Modify: `mcp.json` (add travel-booking server entry)
- Modify: `README.md` (add travel server documentation)

- [ ] **Step 1: Update mcp.json**

Add the travel-booking server entry to `mcp.json`. The file may not exist yet or may have content. Create or update it with:

```json
{
  "mcpServers": {
    "food-ordering": {
      "command": "/Users/soham.intern/Desktop/Mcp-Server/venv/bin/python",
      "args": ["/Users/soham.intern/Desktop/Mcp-Server/server.py"]
    },
    "travel-booking": {
      "command": "/Users/soham.intern/Desktop/Mcp-Server/venv/bin/python",
      "args": ["/Users/soham.intern/Desktop/Mcp-Server/travel_server.py"]
    }
  }
}
```

- [ ] **Step 2: Run the full test suite**

Run: `pytest tests/ -v`
Expected: ALL tests pass (food-ordering + travel-booking)

- [ ] **Step 3: Update README.md**

Add a "Travel Booking Server" section to `README.md` documenting:
- Available tools (search_buses, search_trains, search_flights, add_to_trip, view_trip, book_trip_item, check_booking_status)
- How to run it: `python travel_server.py`
- Same `.env` setup required (PHONEPE_TOKEN)

- [ ] **Step 4: Commit**

```bash
git add mcp.json README.md
git commit -m "docs: add travel booking server config and README"
```

- [ ] **Step 5: Final verification — run all tests**

Run: `pytest tests/ -v`
Expected: All tests PASS
