# 🍕 Food Ordering MCP Server

An MCP server that lets LLM clients browse a food menu, manage a cart, place orders, and process payments via PhonePe.

## Setup

1. **Install dependencies:**

```bash
pip install -r requirements.txt
```

2. **Configure environment:**

```bash
cp .env.example .env
# Edit .env and set your PHONEPE_TOKEN
```

3. **Run the server:**

```bash
python server.py
```

## MCP Client Configuration

Add this to your MCP client config (e.g. Claude Desktop `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "food-ordering": {
      "command": "/absolute/path/to/Mcp-Server/venv/bin/python",
      "args": ["/absolute/path/to/Mcp-Server/server.py"]
    }
  }
}
```

## Available Tools

| Tool | Description |
|------|-------------|
| `browse_menu` | View the full menu or filter by category |
| `add_to_cart` | Add items to your cart by ID |
| `view_cart` | See cart contents and total |
| `place_order` | Place an order and pay via PhonePe |
| `check_order_status` | Check an order's status by ID |

## Menu Categories

- **Starters** — Paneer Tikka, Chicken Wings, Veg Spring Rolls
- **Main Course** — Butter Chicken, Paneer Butter Masala, Biryani
- **Beverages** — Masala Chai, Cold Coffee, Fresh Lime Soda

## Running Tests

```bash
pytest tests/ -v
```

---

# ✈️ Travel Booking MCP Server

An MCP server that lets LLM clients search for transportation options (buses, trains, flights), manage a trip itinerary, and book tickets via PhonePe.

## Setup

1. **Install dependencies:**

```bash
pip install -r requirements.txt
```

2. **Configure environment:**

```bash
cp .env.example .env
# Edit .env and set your PHONEPE_TOKEN
```

3. **Run the server:**

```bash
python travel_server.py
```

## MCP Client Configuration

Add this to your MCP client config (e.g. Claude Desktop `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "travel-booking": {
      "command": "/absolute/path/to/Mcp-Server/venv/bin/python",
      "args": ["/absolute/path/to/Mcp-Server/travel_server.py"]
    }
  }
}
```

## Available Tools

| Tool | Description |
|------|-------------|
| `search_buses` | Search for available buses by route (e.g., "Delhi to Mumbai") |
| `search_trains` | Search for available trains by route |
| `search_flights` | Search for available flights by route |
| `add_to_trip` | Add a bus, train, or flight to your trip by option ID |
| `view_trip` | See all items in your current trip and total cost |
| `book_trip_item` | Book a specific item from your trip and pay via PhonePe |
| `check_booking_status` | Check a booking's status by booking ID |

## Transportation Types

- **Buses** — Comfortable coaches connecting major cities (IDs: B-001, B-002, etc.)
- **Trains** — Long-distance rail options with multiple classes (IDs: T-001, T-002, etc.)
- **Flights** — Domestic and international air travel (IDs: F-001, F-002, etc.)

## Running Tests

```bash
pytest tests/ -v
```
