"""
FastAPI REST API Server for CPU Scheduling Simulator
----------------------------------------------------
Provides endpoints for executing individual scheduling algorithms or running 
all algorithms concurrently to provide comparison metrics.
"""

from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from scheduling import (
    ProcessInput,
    SimulationResult,
    fcfs_scheduling,
    sjf_scheduling,
    priority_scheduling,
    round_robin_scheduling
)

app = FastAPI(
    title="CPU Scheduling Algorithm Simulator API",
    description="Backend service providing FCFS, SJF, Priority, and Round Robin OS process scheduling calculations.",
    version="1.0.0"
)

# Enable CORS for local React frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ScheduleRequest(BaseModel):
    processes: List[ProcessInput]
    quantum: Optional[int] = 2


class CompareResponse(BaseModel):
    fcfs: SimulationResult
    sjf: SimulationResult
    priority: SimulationResult
    rr: SimulationResult


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "CPU Scheduling API"}


@app.post("/api/schedule/fcfs", response_model=SimulationResult)
def run_fcfs(req: ScheduleRequest):
    """Run First-Come, First-Served (FCFS) CPU Scheduling."""
    if not req.processes:
        raise HTTPException(status_code=400, detail="Process list cannot be empty.")
    return fcfs_scheduling(req.processes)


@app.post("/api/schedule/sjf", response_model=SimulationResult)
def run_sjf(req: ScheduleRequest):
    """Run Shortest Job First (SJF - Non-Preemptive) CPU Scheduling."""
    if not req.processes:
        raise HTTPException(status_code=400, detail="Process list cannot be empty.")
    return sjf_scheduling(req.processes)


@app.post("/api/schedule/priority", response_model=SimulationResult)
def run_priority(req: ScheduleRequest):
    """Run Priority Scheduling (Non-Preemptive) CPU Scheduling."""
    if not req.processes:
        raise HTTPException(status_code=400, detail="Process list cannot be empty.")
    return priority_scheduling(req.processes)


@app.post("/api/schedule/rr", response_model=SimulationResult)
def run_round_robin(req: ScheduleRequest):
    """Run Round Robin (RR) CPU Scheduling with configurable Time Quantum."""
    if not req.processes:
        raise HTTPException(status_code=400, detail="Process list cannot be empty.")
    q = req.quantum if req.quantum and req.quantum > 0 else 2
    return round_robin_scheduling(req.processes, time_quantum=q)


@app.post("/api/schedule/compare", response_model=CompareResponse)
def run_comparison(req: ScheduleRequest):
    """Run all 4 scheduling algorithms on the same input dataset for side-by-side comparison."""
    if not req.processes:
        raise HTTPException(status_code=400, detail="Process list cannot be empty.")
    q = req.quantum if req.quantum and req.quantum > 0 else 2
    
    return CompareResponse(
        fcfs=fcfs_scheduling(req.processes),
        sjf=sjf_scheduling(req.processes),
        priority=priority_scheduling(req.processes),
        rr=round_robin_scheduling(req.processes, time_quantum=q)
    )
