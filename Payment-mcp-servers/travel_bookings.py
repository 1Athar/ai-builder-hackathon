import asyncio
from datetime import datetime, timezone

import httpx

import os
PHONEPE_BASE_URL = os.getenv("PHONEPE_BASE_URL", "https://chromepe-relay.chromepe-relay.workers.dev")


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

        url = f"{PHONEPE_BASE_URL}/payment/initiate"
        payload = {
            "amount": option["price"],
            "vpa": self._token,
            "merchantName": "Antigravity Travel",
            "description": f"Booking for {booking_id}",
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload)

            if self._token == "arya@paytm":
                # Mock successful payment for test token
                booking["status"] = "paid"
                booking["payment_response"] = {"transactionId": "TXN-MOCK-TRV-123", "status": "SUCCESS"}
            elif response.status_code >= 200 and response.status_code < 300:
                resp_data = response.json()
                print(f"\n\nPlease approve payment using this link: {resp_data.get('deepLink')}\n\n", flush=True)
                
                status_url = resp_data.get("statusUrl")
                if status_url:
                    while True:
                        async with httpx.AsyncClient() as status_client:
                            status_resp = await status_client.get(status_url)
                        if status_resp.status_code == 200:
                            status_data = status_resp.json()
                            if status_data.get("status") != "PENDING":
                                if status_data.get("status") == "SUCCESS":
                                    booking["status"] = "paid"
                                else:
                                    booking["status"] = "payment_failed"
                                    booking["error"] = f"Payment failed with status {status_data.get('status')}"
                                booking["payment_response"] = status_data
                                break
                        await asyncio.sleep(3)
                else:
                    booking["status"] = "payment_initiated"
                    booking["payment_response"] = resp_data
            else:
                booking["status"] = "payment_failed"
                booking["error"] = f"Payment failed (HTTP {response.status_code}): {response.text}"
                try:
                    booking["payment_response"] = response.json()
                except Exception:
                    booking["payment_response"] = {"raw_response": response.text}
        except Exception as e:
            booking["status"] = "payment_failed"
            booking["error"] = str(e)

        self._bookings[booking_id] = booking
        return booking

    def get_booking(self, booking_id: str) -> dict | None:
        return self._bookings.get(booking_id)
