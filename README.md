# ⚡ SchedulerX & CPU Scheduling Algorithm & Visualizer

A full-stack web application for simulating and visualizing core Operating System process scheduling algorithms in real-time. Built with **Python (FastAPI)** for the algorithmic engine and **React (Vite)** with modern styling for interactive Gantt chart visualization.

Designed for computer science students and engineers preparing for technical OS system design and algorithm interviews.

---

## ✨ Features

- **Interactive Process Workload Manager**: Add, edit, or remove processes with customizable **Process ID**, **Arrival Time (AT)**, **Burst Time (BT)**, and **Priority**.
- **Supported Scheduling Algorithms**:
  1. **FCFS (First-Come, First-Served)** - Non-preemptive arrival queue scheduling.
  2. **SJF (Shortest Job First)** - Non-preemptive optimal burst time scheduling.
  3. **Priority Scheduling** - Non-preemptive priority-based execution (*lower number = higher priority*).
  4. **Round Robin (RR)** - Preemptive time-sharing scheduling with configurable **Time Quantum ($Q$)**.
- **Real-Time Playback Controller**:
  - Play, Pause, Step (+1 time unit), Reset ($t=0$), and Skip to End controls.
  - Adjustable animation speed slider ($0.5\times$ to $4\times$, 100ms – 1000ms per tick).
  - Ticking simulated clock counter ($t = X / totalTime$).
- **Live Ready Queue & Process Dispatcher Panel**: Real-time process state tracking (**Running CPU**, **Ready Queue**, **Upcoming**, and **Completed**).
- **Progressive Gantt Chart Timeline**: Color-coded execution blocks with exact time markers, active glowing execution indicator, and explicit **CPU Idle gap** detection.
- **Detailed Performance Metrics**:
  - Completion Time ($CT$) per process
  - Turnaround Time ($TAT = CT - AT$) per process
  - Waiting Time ($WT = TAT - BT$) per process
  - Average Waiting Time ($Avg\ WT$), Average Turnaround Time ($Avg\ TAT$), and overall **CPU Utilization (%)**.
- **Side-by-Side Comparison Matrix**: Run all 4 algorithms concurrently on the same workload to compare efficiency and identify the optimal algorithm.
- **Built-in Interview Cheat Sheet**: Embedded formula reference, advantages, trade-offs (e.g., *Convoy Effect, Starvation, Aging, Context Switching*), and Q&A notes.

---

## 🛠️ Tech Stack & Architecture

```
CPU Scheduling/
├── backend/                  # FastAPI Application
│   ├── main.py               # REST API endpoints & CORS middleware
│   ├── scheduling.py         # Pure Python scheduling engine & data models
│   ├── test_scheduling.py    # Pytest unit tests for algorithm verification
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React Application (Vite)
│   ├── src/
│   │   ├── components/       # GanttChart, ProcessForm, SummaryCards, ResultsTable, ComparisonView, PlaybackControls, ReadyQueuePanel
│   │   ├── App.jsx           # Main layout & state manager
│   │   ├── api.js            # Fetch client connecting to FastAPI
│   │   └── index.css         # Custom dark-theme design tokens & glassmorphism
│   └── package.json
├── .gitignore                # Git ignore configuration
└── README.md                 # Project documentation
```

- **Backend**: Python 3.10+, FastAPI, Pydantic v2, Pytest.
- **Frontend**: React 18, Vite, Lucide Icons, Pure CSS (Vanilla CSS design system).

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Python 3.10 or higher
- Node.js 18+ & npm

### 1. Start the Backend API (FastAPI)

```bash
# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend test suite
pytest test_scheduling.py

# Start the FastAPI server on port 8000
uvicorn main:app --reload --port 8000
```
The API documentation will be available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 2. Start the Frontend App (React)

Open a new terminal window:

```bash
# Navigate to the frontend directory
cd frontend

# Install node dependencies
npm install

# Start the Vite development server
npm run dev
```
Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## 🧠 OS Scheduling Algorithms Overview

| Algorithm | Type | Selection Criterion | Key Advantage | Key Drawback / Vulnerability |
| :--- | :--- | :--- | :--- | :--- |
| **FCFS** | Non-Preemptive | Arrival Time ($AT$) | Simple FIFO queue implementation | **Convoy Effect** (Short jobs trapped behind long CPU-bound jobs) |
| **SJF** | Non-Preemptive | Burst Time ($BT$) | **Provably optimal** for minimal Avg Waiting Time | **Starvation** of long jobs; impossible to know exact future burst time in real OS |
| **Priority** | Non-Preemptive | Priority Number (Low # = High Priority) | Critical system tasks execute first | **Starvation** of low priority jobs (Resolved in OS via **Aging**) |
| **Round Robin** | Preemptive | Time Quantum ($Q$) | High responsiveness & fairness for time-sharing OS | High **Context Switching** overhead if $Q$ is too small |

---

## 📐 Core Operating System Formulas

$$\text{Turnaround Time (TAT)} = \text{Completion Time (CT)} - \text{Arrival Time (AT)}$$

$$\text{Waiting Time (WT)} = \text{Turnaround Time (TAT)} - \text{Burst Time (BT)}$$

$$\text{CPU Utilization (\%)} = \left( \frac{\text{Total Busy Execution Time}}{\text{Total Schedule Time}} \right) \times 100$$

$$\text{Average Waiting Time} = \frac{\sum \text{WT}}{N}, \quad \text{Average Turnaround Time} = \frac{\sum \text{TAT}}{N}$$

---

