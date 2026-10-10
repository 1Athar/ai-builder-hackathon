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
