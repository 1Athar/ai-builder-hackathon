import time
import httpx
import asyncio

vpa = "demo@chromepe"
base_url = "https://chromepe-relay.chromepe-relay.workers.dev"

async def main():
    print("Starting auto-approver for MCP test...")
    async with httpx.AsyncClient() as client:
        for _ in range(30):
            await asyncio.sleep(2)
            try:
                resp = await client.get(f"{base_url}/payment/pending?vpa={vpa}")
                if resp.status_code == 200:
                    data = resp.json()
                    if data.get("pending") and data.get("txnId"):
                        txn_id = data["txnId"]
                        print(f"Found pending txn: {txn_id}, approving...")
                        cb_resp = await client.post(
                            f"{base_url}/payment/{txn_id}/callback",
                            json={"status": "SUCCESS"}
                        )
                        print(f"Callback status: {cb_resp.status_code}")
                        break
            except Exception as e:
                print(f"Error checking pending: {e}")

if __name__ == "__main__":
    asyncio.run(main())
