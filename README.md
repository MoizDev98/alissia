# University Management System

Hello Karolay and Camilo,

Welcome to our project repository. This guide will help you set up both the Backend (the engine) and the Frontend (the visual part) on your machines without any issues.

Let's work hard to make this project amazing.

---

## Part 1: Backend (FastAPI)

This is the engine room built with Python.

### Prerequisites
Make sure you have installed:
* Python (Version 3.13.12).
* Git.

### Installation Step-by-Step

Follow these commands in your terminal:

**1. Go to the backend folder:**
```bash
cd backend

# Create the Virtual Environment: We need to isolate our libraries.

**Windows:

Shell
python -m venv venv

**Mac/Linux:
Bash
python3.13 -m venv venv

# Activate the Environment: Important: You must see (venv) at the start of your terminal line after this.

Windows:
Shell
venv\Scripts\activate

Mac/Linux:
Bash
source venv/bin/activate

Install Dependencies: This downloads FastAPI and all the tools we need automatically.

Bash
pip install -r requirements.txt

Environment Variables: Create a copy of the example file to set up your local configuration.

Bash
cp .env.example .env

Start the Server: Enter the app folder and run the server.

Bash
cd app
uvicorn main:app --reload

If everything went well, you will see a message saying the server is running at https://www.google.com/search?q=http://127.0.0.1:8000.

Tip: Go to https://www.google.com/search?q=http://127.0.0.1:8000/docs to see the automatic documentation and test our API.



## Backend Folder Structure
Here is a brief explanation of our organization:

app/: The main folder. All our code lives here.

main.py: The main switch. It starts the application and connects everything.

routes/: The "Waiters". Contains the URLs (e.g., /login, /create-user). They take the order and pass it to the controller.

controllers/: The "Chefs". They receive the order from the routes and coordinate the logic.

models/: The "Blueprints". Defines how our Database tables look (columns and types).

services/: Specialized Kitchen. For complex tasks or heavy logic, the controller delegates work here to avoid getting overloaded.

config/: Where we keep important settings, like the database connection.

utils/: Our Toolbox. Small helper functions used across the project (e.g., email validation).

requirements.txt: The shopping list. Tells Python which libraries to install.

SQL: is used to store test queries, so that you only need to copy and paste them into the database; it's a test folder.

Uploads: This is used to upload images, PDFs, etc., as long as it's content and not code, since code wouldn't be possible in the database because it would be too large.

Here is the clean, emoji-free Markdown text, ready for you to copy and paste directly into your README.md file. I have updated the Python version to 3.13.12 as you requested.

Markdown
# University Management System

Hello Karolay and Camilo,

Welcome to our project repository. This guide will help you set up both the Backend (the engine) and the Frontend (the visual part) on your machines without any issues.

Let's work hard to make this project amazing.

---

## Part 1: Backend (FastAPI)

This is the engine room built with Python.

### Prerequisites
Make sure you have installed:
* Python (Version 3.13.12).
* Git.

### Installation Step-by-Step

Follow these commands in your terminal:

**1. Go to the backend folder:**
```bash
cd backend
2. Create the Virtual Environment: We need to isolate our libraries.

Windows:

Bash
python -m venv venv
Mac/Linux:

Bash
python3.13 -m venv venv
3. Activate the Environment: Important: You must see (venv) at the start of your terminal line after this.

Windows:

Bash
venv\Scripts\activate
Mac/Linux:

Bash
source venv/bin/activate
4. Install Dependencies: This downloads FastAPI and all the tools we need automatically.

Bash
pip install -r requirements.txt
5. Environment Variables: Create a copy of the example file to set up your local configuration.

Bash
cp .env.example .env
6. Start the Server: Enter the app folder and run the server.

Bash
cd app
uvicorn main:app --reload
If everything went well, you will see a message saying the server is running at https://www.google.com/search?q=http://127.0.0.1:8000.

Tip: Go to https://www.google.com/search?q=http://127.0.0.1:8000/docs to see the automatic documentation and test our API.

Backend Folder Structure
Here is a brief explanation of our organization:

app/: The main folder. All our code lives here.

main.py: The main switch. It starts the application and connects everything.

routes/: The "Waiters". Contains the URLs (e.g., /login, /create-user). They take the order and pass it to the controller.

controllers/: The "Chefs". They receive the order from the routes and coordinate the logic.

models/: The "Blueprints". Defines how our Database tables look (columns and types).

services/: Specialized Kitchen. For complex tasks or heavy logic, the controller delegates work here to avoid getting overloaded.

config/: Where we keep important settings, like the database connection.

utils/: Our Toolbox. Small helper functions used across the project (e.g., email validation).

requirements.txt: The shopping list. Tells Python which libraries to install.



### Part 2: Frontend (Angular)
This is what the user sees. To avoid compatibility issues, we must use the exact same versions.

Exact Requirements
Please check your versions before starting:

Node.js: Version 24.13.0.

Check with: node -v

Angular CLI: Version 20.3.15.

Check with: ng version

Installation Step-by-Step
1. Install the CLI: If you do not have it or have an old version, run this to match the project version:

Bash
npm install -g @angular/cli@20.3.15

2. Go to the frontend folder:

Bash
cd frontend
3. Install Project Dependencies: This downloads the node_modules folder based on our configuration.

Bash
npm install
4. Launch the App: To see the website running:

Bash
ng serve --open
It should automatically open a tab at http://localhost:4200.

Frontend Folder Structure
src/app/: The main application code.

src/app/components/: The building blocks of our page (Buttons, Forms, Navbars).

src/app/services/: The logic to connect with our Backend API.

src/assets/: Static resources like images, logos, and fonts.

src/styles.scss: Global colors and styles for the whole app.

