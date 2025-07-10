# AI Voice-Powered Line Blocking Assistant

This project is a functional prototype of an AI-powered voice and text chatbot designed to automate the mobile line blocking process for a telecommunications company.

## Features

- **Voice and Text Interaction:** Communicate with the bot using either your voice or text input.
- **Identity Verification:** Simulates user identity validation by confirming the last three digits of a document.
- **Automated Ticket Generation:** Automatically generates a unique ticket number for each valid request.
- **Line Blocking Simulation:** Simulates the activation of a line block in a backend system.
- **User-Friendly Interface:** A clean and intuitive chat interface built with React.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Python 3.8+ and `pip`
- Node.js and `npm`
- A modern web browser that supports the Web Speech API (e.g., Chrome, Edge)

### Backend Setup

The backend is a Python application built with the FastAPI framework.

1.  **Navigate to the project root directory:**
    ```bash
    cd /mnt/c/Users/frans/Documents/Repos/TP
    ```

2.  **Create and activate a Python virtual environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install the required Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the backend server:**
    The server will start on `http://127.0.0.1:8000`.
    ```bash
    uvicorn main:app --reload
    ```

### Frontend Setup

The frontend is a React application.

1.  **Navigate to the `frontend` directory:**
    ```bash
    cd /mnt/c/Users/frans/Documents/Repos/TP/frontend
    ```

2.  **Install the required Node.js dependencies:**
    ```bash
    npm install
    ```

3.  **Start the React development server:**
    The application will open automatically in your browser at `http://localhost:3000`.
    ```bash
    npm start
    ```

## How to Use the Application

1.  Ensure both the backend and frontend servers are running.
2.  Open your browser and navigate to `http://localhost:3000`.
3.  Click the "Start Over" button to begin the process.
4.  When prompted, provide the phone number you wish to block by either speaking or typing.
5.  Next, provide the last three digits of your identification document.
6.  If the information is valid, the bot will confirm the block and provide a ticket number. If not, you will be prompted to try again.
