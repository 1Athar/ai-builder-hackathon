# Travel Booking MCP Server — Design Spec

**Date:** 2026-05-28
**Status:** Approved

## Overview

A new MCP server for travel booking (buses, trains, flights) using static mock data for Indian cities. Runs as a separate FastMCP process alongside the existing food-ordering server. Reuses PhonePe payment integration for bookings.

## User Flow

1. Search for buses, trains, or flights between Indian cities
2. Add selected options to a trip plan
3. View the full trip itinerary
4. Book and pay for each item individually via PhonePe
5. Check booking status

## Architecture

Four modules mirroring the food-ordering server pattern:

```
travel_data.py       — static mock schedules + search helpers
trip_manager.py      — trip plan state (add/remove/view/clear)
travel_bookings.py   — booking creation + PhonePe payment
travel_server.py     — FastMCP server exposing 7 tools
```

## Data Layer — `travel_data.py`

### Cities

Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Jaipur

### Bus Data (~10 routes)

Each bus entry:

| Field       | Type   | Example                |
|-------------|--------|------------------------|
| id          | str    | "BUS-1"                |
| operator    | str    | "RedBus Express"       |
| from_city   | str    | "Delhi"                |
| to_city     | str    | "Jaipur"               |
| departure   | str    | "06:00"                |
| arrival     | str    | "12:00"                |
| duration    | str    | "6h"                   |
| price       | int    | 800                    |
| bus_type    | str    | "AC Sleeper"           |

### Train Data (~10 routes)

Each train entry:

| Field        | Type   | Example               |
|--------------|--------|------------------------|
| id           | str    | "TRN-1"               |
| train_name   | str    | "Rajdhani Express"     |
| train_number | str    | "12951"                |
| from_city    | str    | "Delhi"                |
| to_city      | str    | "Mumbai"               |
| departure    | str    | "16:00"                |
| arrival      | str    | "08:00"                |
| duration     | str    | "16h"                  |
| price        | int    | 2500                   |
| travel_class | str    | "AC 2-Tier"            |

### Flight Data (~10 routes)

Each flight entry:

| Field         | Type   | Example              |
|---------------|--------|----------------------|
| id            | str    | "FLT-1"              |
| airline       | str    | "IndiGo"             |
| flight_number | str    | "6E-2001"            |
| from_city     | str    | "Delhi"              |
| to_city       | str    | "Bangalore"          |
| departure     | str    | "08:00"              |
| arrival       | str    | "11:00"              |
| duration      | str    | "3h"                 |
| price         | int    | 5500                 |
| travel_class  | str    | "Economy"            |

### Helper Functions

- `search_buses(from_city, to_city)` — returns list of matching buses
- `search_trains(from_city, to_city)` — returns list of matching trains
- `search_flights(from_city, to_city)` — returns list of matching flights
- `get_option_by_id(option_id)` — lookup any transport option by ID prefix (BUS/TRN/FLT)

All searches are case-insensitive. Return empty list if no matches.

## Trip Manager — `trip_manager.py`

A `TripManager` class holding in-memory trip state (same pattern as `CartManager`):

- `add(option_id)` — adds a transport option to the trip plan; returns success/error dict
- `remove(option_id)` — removes an option from the trip
- `view()` — returns the raw trip dict
- `get_items_snapshot()` — returns a list of dicts with option details for display/booking
- `get_total()` — sum of all selected option prices
- `clear()` — resets the trip
- `is_empty()` — returns bool

Internal state: `dict[str, dict]` keyed by option ID.

## Bookings — `travel_bookings.py`

A `BookingManager` class (mirrors `OrderManager`):

- Constructor takes `phonepe_token: str`
- `book(option, passenger_name, phone_number)` — creates booking, calls PhonePe API
- `get_booking(booking_id)` — retrieve booking by ID
- Booking IDs: `TRV-1`, `TRV-2`, etc. (auto-incrementing counter)

### Booking Record

```python
{
    "booking_id": "TRV-1",
    "transport_type": "bus",        # derived from option ID prefix
    "option": { ... },              # full transport option details
    "passenger_name": "...",
    "phone_number": "...",
    "status": "paid" | "payment_failed",
    "payment_response": { ... },
    "error": "...",                 # only on failure
    "created_at": "2026-05-28T..."
}
```

### PhonePe Integration

Same pattern as `orders.py`:
- POST to `https://api.phonepe.com/phonepe/pay/{token}`
- Payload: `booking_id`, `amount`, `passenger_name`, `phone_number`, `option`
- HTTP 2xx → status "paid"; otherwise → status "payment_failed"

## MCP Tools — `travel_server.py`

Server name: `FastMCP("travel-booking")`

Requires `PHONEPE_TOKEN` environment variable.

### Tools

| # | Tool                  | Parameters                                | Description                              |
|---|----------------------|-------------------------------------------|------------------------------------------|
| 1 | `search_buses`       | `from_city: str, to_city: str`           | Search available buses between cities    |
| 2 | `search_trains`      | `from_city: str, to_city: str`           | Search available trains between cities   |
| 3 | `search_flights`     | `from_city: str, to_city: str`           | Search available flights between cities  |
| 4 | `add_to_trip`        | `option_id: str`                         | Add a bus/train/flight to the trip plan  |
| 5 | `view_trip`          | (none)                                   | View current trip itinerary and total    |
| 6 | `book_trip_item`     | `option_id: str, passenger_name: str, phone_number: str` | Book & pay for one trip item |
| 7 | `check_booking_status` | `booking_id: str`                      | Check status of a booking                |

### Tool Response Patterns

- Search tools return JSON array of matching options, or a message if none found
- `add_to_trip` returns confirmation with item details and running total
- `view_trip` returns formatted itinerary with all items and total
- `book_trip_item` returns booking confirmation or payment error
- `check_booking_status` returns formatted booking details

## Testing

| Test File                      | Covers                                           |
|-------------------------------|--------------------------------------------------|
| `tests/test_travel_data.py`    | Search functions, edge cases (unknown city, case) |
| `tests/test_trip_manager.py`   | Add/remove/view/clear, empty state, duplicates   |
| `tests/test_travel_bookings.py`| Booking creation, payment mock (success/failure)  |
| `tests/test_travel_server.py`  | Tool integration tests via FastMCP               |

Uses `pytest` + `pytest-asyncio`. Payment calls mocked with `unittest.mock`.

## Configuration

- Same `.env` file, same `PHONEPE_TOKEN` variable
- Separate entry in `mcp.json` for the travel server
- No new dependencies beyond what's in `requirements.txt`

## Out of Scope

- Real API integrations (IRCTC, RedBus, airline APIs)
- Date-based scheduling (all times are static strings)
- Seat selection or availability tracking
- Multi-passenger bookings
- Hotel or accommodation booking
- Return trips
