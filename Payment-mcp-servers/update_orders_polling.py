import re

with open("orders.py", "r") as f:
    content = f.read()

if "import asyncio" not in content:
    content = "import asyncio\n" + content

old_status = """            elif response.status_code >= 200 and response.status_code < 300:
                resp_data = response.json()
                order["status"] = "payment_initiated"
                order["payment_response"] = resp_data"""

new_status = """            elif response.status_code >= 200 and response.status_code < 300:
                resp_data = response.json()
                print(f"\\n\\nPlease approve payment using this link: {resp_data.get('deepLink')}\\n\\n", flush=True)
                
                status_url = resp_data.get("statusUrl")
                if status_url:
                    while True:
                        status_resp = await client.get(status_url)
                        if status_resp.status_code == 200:
                            status_data = status_resp.json()
                            if status_data.get("status") != "PENDING":
                                if status_data.get("status") == "SUCCESS":
                                    order["status"] = "paid"
                                else:
                                    order["status"] = "payment_failed"
                                    order["error"] = f"Payment failed with status {status_data.get('status')}"
                                order["payment_response"] = status_data
                                break
                        await asyncio.sleep(3)
                else:
                    order["status"] = "payment_initiated"
                    order["payment_response"] = resp_data"""
content = content.replace(old_status, new_status)

with open("orders.py", "w") as f:
    f.write(content)
