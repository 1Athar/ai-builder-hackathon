import re

with open("travel_bookings.py", "r") as f:
    content = f.read()

# Replace BASE_URL
content = re.sub(
    r'PHONEPE_BASE_URL = "https://api\.phonepe\.com"',
    'import os\nPHONEPE_BASE_URL = os.getenv("PHONEPE_BASE_URL", "https://chromepe-relay.chromepe-relay.workers.dev")',
    content
)

# Replace url and payload
old_url_payload = """        url = f"{PHONEPE_BASE_URL}/phonepe/pay/{self._token}"
        payload = {
            "booking_id": booking_id,
            "amount": option["price"],
            "passenger_name": passenger_name,
            "phone_number": phone_number,
            "option": option,
        }"""

new_url_payload = """        url = f"{PHONEPE_BASE_URL}/payment/initiate"
        payload = {
            "amount": option["price"],
            "vpa": self._token,
            "merchantName": "Antigravity Travel",
            "description": f"Booking for {booking_id}",
        }"""
content = content.replace(old_url_payload, new_url_payload)

# Replace status handling
old_status = """            elif response.status_code >= 200 and response.status_code < 300:
                booking["status"] = "paid"
                booking["payment_response"] = response.json()"""

new_status = """            elif response.status_code >= 200 and response.status_code < 300:
                resp_data = response.json()
                booking["status"] = "payment_initiated"
                booking["payment_response"] = resp_data"""
content = content.replace(old_status, new_status)

with open("travel_bookings.py", "w") as f:
    f.write(content)
