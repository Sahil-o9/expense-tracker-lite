# 📊 TrackLite - Personal Expense Manager

TrackLite is a sleek, modern, and lightweight expense tracking web application built using the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS. It allows users to log expenses, categorize spending, track total budgets in real-time, and seamlessly switch between multiple user accounts.

---

## ✨ Features

- **⚡ Real-time Expense Tracking:** Instantly add, view, and delete expenses.
- **🏷️ Smart Categorization:** Filter expenses by categories like Food, Shopping, Travel, Bills, Education, and more.
- **🔍 Quick Search & Filters:** Search transactions dynamically with instant UI updates.
- **📊 Visual Share Indicator:** Visual percentage bars to track how much each expense contributes to your total spending.
- **👥 Multi-Account Support:** Switch between saved user accounts directly from the UI menu.
- **🌙 Dark Mode Support:** Seamless toggle between Light and Dark themes (persisted in local storage).
- **📱 Responsive Layout:** Optimized for mobile, tablet, and desktop views.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS**
- **Axios** (API requests)
- **React Router DOM**

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose**
- **JSON Web Tokens (JWT)** for authentication

---

## 🚀 Getting Started

Follow these steps to run TrackLite locally on your machine.

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
- [Git](https://git-scm.com/)

---

### 📥 Installation & Setup

#### 1. Clone the repository
```bash
git clone [https://github.com/your-username/tracklite.git](https://github.com/your-username/tracklite.git)
cd tracklite
2. Backend Setup
Bash
# Navigate to backend directory (if separate, or stay in root)
cd server

# Install dependencies
npm install

# Create a .env file in the backend folder
touch .env
Add the following environment variables to your server/.env:

Code snippet
PORT=5000
MONGO_URI=mongodb://localhost:27017/tracklite
JWT_SECRET=your_jwt_secret_key_here
Start the backend server:

Bash
npm start
# or for development:
npm run dev
3. Frontend Setup
Open a new terminal window:

Bash
# Navigate to frontend directory
cd client

# Install dependencies
npm install

# Create a .env file in client directory (optional)
echo "VITE_API_URL=http://localhost:5000" > .env
Start the frontend development server:

Bash
npm run dev
Open your browser and visit http://localhost:5173.

📁 Project Structure
Plaintext
tracklite/
├── client/                # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Dashboard, Login, Register
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
│
└── server/                # Express Backend
    ├── config/            # DB connection
    ├── controllers/       # Route controllers
    ├── models/            # Mongoose schemas (User, Expense)
    ├── routes/            # API endpoints
    ├── server.js          # App entry point
    └── package.json
🔒 Environment Variables
Variable	Description	Default
PORT	Backend port number	5000
MONGO_URI	MongoDB Connection String	mongodb://localhost:27017/tracklite
JWT_SECRET	Secret key for JWT signing	—
VITE_API_URL	Frontend API base endpoint	http://localhost:5000
🤝 Contributing
Contributions, issues, and feature requests are welcome!

Feel free to check the issues page.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (`git push origin featureNormally I can help with things like this, but I don't seem to have access to that content. You can try again or ask me for something else.
