from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import string

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock database for TelcoID
telco_id_db = {
    "123456789": "123",
    "987654321": "456",
}

class BlockRequest(BaseModel):
    phone_number: str
    last_three_digits: str

@app.post("/block-line/")
async def block_line(request: BlockRequest):
    """
    Handles the mobile line blocking request.
    """
    # Step 1: Validate user identity
    if not validate_user(request.phone_number, request.last_three_digits):
        raise HTTPException(status_code=401, detail="Invalid identity")

    # Step 2: Generate a ticket
    ticket_id = generate_ticket()

    # Step 3: Activate line block (simulation)
    activate_block(request.phone_number)

    return {"message": "Line blocked successfully", "ticket_id": ticket_id}

def validate_user(phone_number: str, last_three_digits: str):
    """
    Simulates validating user identity with TelcoID.
    """
    return telco_id_db.get(phone_number) == last_three_digits

def generate_ticket():
    """
    Generates a random ticket ID.
    """
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=10))

def activate_block(phone_number: str):
    """
    Simulates activating the line block in a client application.
    """
    print(f"Simulating line block for {phone_number}")

