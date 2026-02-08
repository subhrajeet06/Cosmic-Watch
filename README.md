# 🚀 Cosmic Watch
## Interstellar Asteroid Tracker & Risk Analyzer

Cosmic Watch is a **full-stack space monitoring platform** that tracks **Near-Earth Objects (NEOs)** in real time using NASA APIs and converts complex astronomical data into **simple risk insights, alerts, and interactive 3D visualization**.

Think of it like:

🌍 **Google Maps + Weather App … but for Asteroids**

---

# 🌌 Features

## 🔐 Authentication
- User signup & login
- Secure sessions
- Save watched asteroids
- Personalized alerts

---

## 📡 Real-Time NASA Data Feed
Integrated with **NASA NeoWs API**

Displays:
- Asteroid name
- Velocity
- Diameter
- Distance from Earth
- Hazard status
- Close-approach time

---

## ⚠ Risk Analysis Engine
Custom algorithm calculates risk score:

risk = (size × speed) ÷ distance

yaml
Copy code

Classification:
- 🟢 Safe
- 🟡 Medium
- 🔴 Hazardous

Helps users quickly understand threat levels.

---

## 🔔 Alert & Notification System
- Close approach alerts
- Watchlist notifications
- Dashboard warnings
- Scheduled background checks

Example:
⚠ Asteroid 2026 AB passing within 300,000 km today!

yaml
Copy code

---

## 🌍 3D Visualization (Bonus Feature)
Built using **Three.js**

Includes:
- Earth model
- Asteroids orbiting Earth
- Real-time motion
- Mouse rotate/zoom controls
- Risk-based color coding

Makes the dashboard interactive and visually impressive.

---

## 🐳 Docker Deployment
Containerized for easy setup:

docker-compose up

yaml
Copy code

Runs:
- frontend
- backend
- database

---

# 🛠 Tech Stack

## Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- Three.js

## Backend (API Ready)
- Node.js + Express  
OR  
- Spring Boot (Java)

## Database
- MongoDB / MySQL / PostgreSQL

## Tools
- Docker
- ESLint
- Vitest
- Bun / npm

---

# 📁 Project Structure

Cosmic-Watch/
│
├── public/ # Static assets
│ ├── favicon.ico
│ ├── placeholder.svg
│ └── robots.txt
│
├── src/
│ ├── assets/
│ ├── components/
│ ├── hooks/
│ ├── lib/ 
│ ├── pages/
│ ├── test/
│ ├── App.tsx
│ ├── main.tsx
│ └── index.css
│
├── index.html
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md

---

🎯 Use Cases
Space enthusiasts

Students & researchers

Astronomy clubs

Educational demos

Hackathons

🤝 Contributing
Pull requests welcome!

Steps:

Fork repository

Create branch

Make changes

Submit PR

📜 License
MIT License

👨‍💻 Author
Suvendu
B.Tech CSE (AIML)

Built with ❤️ curiosity + code + space science
