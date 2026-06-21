# server/routes/market.py
from fastapi import APIRouter, HTTPException

router = APIRouter()

market_orders = []

@router.get("/market")
def get_market():
    return market_orders

@router.post("/market/order")
def create_order(data: dict):
    # Example: {type, resource, amount, price, player_id}
    order = data.copy()
    order['id'] = len(market_orders) + 1
    market_orders.append(order)
    return order
