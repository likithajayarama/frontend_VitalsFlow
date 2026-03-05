# AI Care – Smart Hospital Assistant Dashboard

A modern React-based healthcare dashboard built for the **National Level AI Hackathon**. Connects three AI modules — Smart Triage, Ambient Scribe, and Digital Caretaker — through API endpoints.

![Smart ER Triage](https://img.shields.io/badge/Module-Smart%20Triage-blue)
![Ambient Scribe](https://img.shields.io/badge/Module-Ambient%20Scribe-purple)
![Digital Caretaker](https://img.shields.io/badge/Module-Digital%20Caretaker-green)

---

## 🧰 Prerequisites

- **Node.js** v18 or higher — [Download here](https://nodejs.org)
- **npm** (comes bundled with Node.js)

Verify installation:

```bash
node -v
npm -v
```

---

## 🚀 Installation & Running

### 1. Clone or Copy the Project

Copy the entire `HACKATHON` folder to your computer.

> ⚠️ **Do NOT copy the `node_modules` folder.** It will be regenerated in the next step.

### 2. Install Dependencies

Open a terminal in the project directory and run:

```bash
cd path/to/HACKATHON
npm install
```

This installs all required packages: React, React Router, Axios, Recharts, React Icons, etc.

### 3. Start the Development Server

```bash
npm run dev
```

### 4. Open in Browser

Navigate to:

```
http://localhost:5173
```

The dashboard is now running! 🎉

---

## 🔌 Connecting to FastAPI Backend (Optional)

By default, the dashboard uses **built-in dummy data** so it works standalone for demos.

To connect to your FastAPI backend, create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000
```

### API Endpoints Expected

| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| POST   | `/api/triage`          | Patient triage risk scoring     |
| POST   | `/api/scribe`          | Audio transcription → SOAP notes|
| GET    | `/api/monitor/:patientId` | Patient vitals monitoring    |

---

## 📁 Project Structure

```
HACKATHON/
├── public/
├── src/
│   ├── components/
│   │   ├── Layout.jsx        # Main layout wrapper
│   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   ├── Navbar.jsx        # Top navigation bar
│   │   ├── Footer.jsx        # Footer
│   │   └── Spinner.jsx       # Loading spinner
│   ├── pages/
│   │   ├── TriagePage.jsx    # Smart ER Triage
│   │   ├── ScribePage.jsx    # Ambient Scribe
│   │   └── MonitorPage.jsx   # Digital Caretaker
│   ├── services/
│   │   └── api.js            # API service + fallback data
│   ├── App.jsx               # Router setup
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── package.json
├── vite.config.js
└── README.md
```

---

## 📄 Pages Overview

### 1. Smart ER Triage (`/triage`)
- Patient intake form (name, age, vitals, symptoms)
- AI-powered risk score (1–5) with color-coded display
- Animated alert banner for high-risk patients

### 2. Ambient Scribe (`/scribe`)
- Audio recording via microphone with timer
- `.wav` file upload option
- Auto-generated SOAP notes (Subjective, Objective, Assessment, Plan)
- Approve & Save functionality

### 3. Digital Caretaker (`/monitor`)
- Patient summary card with discharge details
- Real-time vital sign cards (Heart Rate, SpO₂, Blood Pressure)
- Trend line charts (powered by Recharts)
- WhatsApp bot monitoring status

---

## 🛠 Tech Stack

| Technology       | Purpose                    |
|------------------|----------------------------|
| React + Vite     | Frontend framework         |
| React Router     | Client-side routing        |
| Axios            | HTTP requests              |
| Recharts         | Data visualization charts  |
| React Icons      | Icon library               |
| Vanilla CSS      | Styling                    |

---

## 👥 Team

**AI Care** — National Level AI Hackathon

---

## 📝 Quick Start Summary

```bash
npm install       # Install dependencies (one-time)
npm run dev       # Start development server
# Open http://localhost:5173
```
