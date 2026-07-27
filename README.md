# 📊 TrackLite - Personal Expense Manager

TrackLite is a sleek, modern, and lightweight expense tracking web application. It allows users to log expenses, categorize them, and visualize their spending patterns with ease.

🌐 **Live Demo:** [Expense Tracker Lite](https://expense-tracker-lite-rho.vercel.app/login)

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
git clone https://github.com/Sahil-o9/expense-tracker-lite.git
cd expense-tracker-lite
```

#### 2. Backend Setup

Navigate to backend directory:

```bash
cd server

# Install dependencies
npm install

# Create a .env file in the backend folder
touch .env
```

Add the following environment variables to your `server/.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/tracklite
JWT_SECRET=your_jwt_secret_key_here
```

Start the backend server:

```bash
npm start
# or for development:
npm run dev
```

#### 3. Frontend Setup

Open a new terminal window:

```bash
cd client

# Install dependencies
npm install

# Create a .env file in client directory
echo "VITE_API_URL=http://localhost:5000" > .env
```

Start the frontend development server:

```bash
npm run dev
```

Open your browser and visit `http://localhost:5173`.

---

## 📁 Project Structure

```
expense-tracker-lite/
├── client/                # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Dashboard, Login, Register
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                # Express Backend
    ├── config/            # DB connection
    ├── controllers/       # Route controllers
    ├── models/            # Mongoose schemas (User, Expense)
    ├── routes/            # API endpoints
    ├── server.js          # App entry point
    └── package.json
```

---

## 🔒 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend port number | `5000` |
| `MONGO_URI` | MongoDB Connection String | `mongodb://localhost:27017/tracklite` |
| `JWT_SECRET` | Secret key for JWT signing | — |
| `VITE_API_URL` | Frontend API base URL | `http://localhost:5000` |

---

## 🎯 Usage

1. **Sign Up/Login** with your credentials
2. **Add Expense** - Click the add button and fill in the expense details
3. **Categorize** - Assign the expense to a category
4. **Track** - View real-time statistics and visual breakdowns
5. **Switch Accounts** - Toggle between saved user profiles

---

## 📸 Screenshots

[Add screenshots here]

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👤 Author

**Sahil-o9**

- GitHub: [@Sahil-o9](https://github.com/Sahil-o9)

---

## 💡 Support

If you found this project helpful, please ⭐ star the repository!

For questions or support, feel free to open an issue.

---

**Happy Tracking! 📈**
