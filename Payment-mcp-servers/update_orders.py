import re

with open("orders.py", "r") as f:
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
            "order_id": order_id,
            "amount": total,
            "customer_name": customer_name,
            "phone_number": phone_number,
            "items": items,
        }"""

new_url_payload = """        url = f"{PHONEPE_BASE_URL}/payment/initiate"
        payload = {
            "amount": total,
            "vpa": self._token,
            "merchantName": "Antigravity Orders",
            "description": f"Payment for {order_id}",
        }"""
content = content.replace(old_url_payload, new_url_payload)

# Replace status handling
old_status = """            elif response.status_code >= 200 and response.status_code < 300:
                order["status"] = "paid"
                order["payment_response"] = response.json()"""

new_status = """            elif response.status_code >= 200 and response.status_code < 300:
                resp_data = response.json()
                order["status"] = "payment_initiated"
                order["payment_response"] = resp_data"""
content = content.replace(old_status, new_status)

with open("orders.py", "w") as f:
    f.write(content)
