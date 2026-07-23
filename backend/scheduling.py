"""
CPU Scheduling Algorithm Engine
-------------------------------
This module provides pure Python implementations of fundamental Operating System 
CPU scheduling algorithms:
1. First-Come, First-Served (FCFS)
2. Shortest Job First (SJF - Non-Preemptive)
3. Priority Scheduling (Non-Preemptive, Lower Number = Higher Priority)
4. Round Robin (RR - Preemptive with Time Quantum)

Core OS Concepts & Formulas:
- Completion Time (CT): Time at which process finishes execution.
- Turnaround Time (TAT): Total time spent in system = CT - Arrival Time (AT).
- Waiting Time (WT): Total time spent waiting in ready queue = TAT - Burst Time (BT).
- CPU Utilization: (Total Busy Time / Total Execution Time) * 100%.
"""

from typing import List, Dict, Optional
from pydantic import BaseModel, Field


class ProcessInput(BaseModel):
    pid: str = Field(..., description="Unique Process ID (e.g. P1, P2)")
    arrival_time: int = Field(..., ge=0, description="Arrival Time in Ready Queue (>= 0)")
    burst_time: int = Field(..., gt=0, description="CPU Burst Time needed (> 0)")
    priority: int = Field(default=1, description="Priority level (Lower value = Higher priority)")


class GanttBlock(BaseModel):
    pid: str = Field(..., description="Process ID executing during block or 'IDLE'")
    start_time: int = Field(..., ge=0)
    end_time: int = Field(..., ge=0)


class ProcessResult(BaseModel):
    pid: str
    arrival_time: int
    burst_time: int
    priority: int
    completion_time: int
    turnaround_time: int
    waiting_time: int


class SimulationResult(BaseModel):
    algorithm: str
    quantum: Optional[int] = None
    processes: List[ProcessResult]
    gantt: List[GanttBlock]
    avg_waiting_time: float
    avg_turnaround_time: float
    cpu_utilization: float
    total_time: int


def calculate_metrics(
    processes: List[ProcessInput],
    completion_times: Dict[str, int],
    gantt: List[GanttBlock],
    algorithm_name: str,
    quantum: Optional[int] = None
) -> SimulationResult:
    """
    Computes final process metrics (TAT, WT) and summary statistics.
    """
    process_results: List[ProcessResult] = []
    total_wt = 0
    total_tat = 0

    for proc in processes:
        ct = completion_times[proc.pid]
        tat = ct - proc.arrival_time
        wt = tat - proc.burst_time

        total_tat += tat
        total_wt += wt

        process_results.append(
            ProcessResult(
                pid=proc.pid,
                arrival_time=proc.arrival_time,
                burst_time=proc.burst_time,
                priority=proc.priority,
                completion_time=ct,
                turnaround_time=tat,
                waiting_time=wt
            )
        )

    # Sort results by original PID or arrival order for display
    process_results.sort(key=lambda x: x.pid)

    num_processes = len(processes)
    avg_wt = round(total_wt / num_processes, 2) if num_processes > 0 else 0.0
    avg_tat = round(total_tat / num_processes, 2) if num_processes > 0 else 0.0

    # Calculate CPU utilization: excludes IDLE time
    total_time = gantt[-1].end_time if gantt else 0
    busy_time = sum(block.end_time - block.start_time for block in gantt if block.pid != "IDLE")
    cpu_util = round((busy_time / total_time) * 100, 2) if total_time > 0 else 0.0

    return SimulationResult(
        algorithm=algorithm_name,
        quantum=quantum,
        processes=process_results,
        gantt=gantt,
        avg_waiting_time=avg_wt,
        avg_turnaround_time=avg_tat,
        cpu_utilization=cpu_util,
        total_time=total_time
    )


# -------------------------------------------------------------------
# 1. First-Come, First-Served (FCFS) - Non-Preemptive
# -------------------------------------------------------------------
def fcfs_scheduling(processes: List[ProcessInput]) -> SimulationResult:
    """
    FCFS Scheduling:
    - Non-preemptive algorithm.
    - Processes are executed strictly in order of their arrival time.
    - Simple and fair in arrival order, but vulnerable to the "Convoy Effect"
      (where short processes wait behind a long process).
    """
    if not processes:
        return SimulationResult(
            algorithm="FCFS", processes=[], gantt=[],
            avg_waiting_time=0.0, avg_turnaround_time=0.0,
            cpu_utilization=0.0, total_time=0
        )

    # Sort processes by Arrival Time (preserve original list order for ties)
    sorted_procs = sorted(processes, key=lambda p: (p.arrival_time, p.pid))

    current_time = 0
    gantt: List[GanttBlock] = []
    completion_times: Dict[str, int] = {}

    for proc in sorted_procs:
        # Check if CPU is idle before this process arrives
        if current_time < proc.arrival_time:
            gantt.append(GanttBlock(pid="IDLE", start_time=current_time, end_time=proc.arrival_time))
            current_time = proc.arrival_time

        start_time = current_time
        end_time = current_time + proc.burst_time
        gantt.append(GanttBlock(pid=proc.pid, start_time=start_time, end_time=end_time))
        
        current_time = end_time
        completion_times[proc.pid] = current_time

    return calculate_metrics(processes, completion_times, gantt, "First-Come, First-Served (FCFS)")


# -------------------------------------------------------------------
# 2. Shortest Job First (SJF) - Non-Preemptive
# -------------------------------------------------------------------
def sjf_scheduling(processes: List[ProcessInput]) -> SimulationResult:
    """
    SJF (Shortest Job First) Scheduling:
    - Non-preemptive algorithm.
    - Selects the waiting process with the smallest CPU burst time.
    - Minimizes average waiting time for a given set of processes.
    - May cause starvation for long processes if short processes keep arriving.
    """
    if not processes:
        return SimulationResult(
            algorithm="SJF", processes=[], gantt=[],
            avg_waiting_time=0.0, avg_turnaround_time=0.0,
            cpu_utilization=0.0, total_time=0
        )

    unexecuted = list(processes)
    current_time = 0
    gantt: List[GanttBlock] = []
    completion_times: Dict[str, int] = {}

    while unexecuted:
        # Find processes that have arrived by current_time
        arrived = [p for p in unexecuted if p.arrival_time <= current_time]

        if not arrived:
            # CPU is idle until the next earliest process arrives
            next_arrival = min(p.arrival_time for p in unexecuted)
            gantt.append(GanttBlock(pid="IDLE", start_time=current_time, end_time=next_arrival))
            current_time = next_arrival
            continue

        # Pick process with shortest burst time (tie-breaker: earliest arrival, then PID)
        best_proc = min(arrived, key=lambda p: (p.burst_time, p.arrival_time, p.pid))

        start_time = current_time
        end_time = current_time + best_proc.burst_time
        gantt.append(GanttBlock(pid=best_proc.pid, start_time=start_time, end_time=end_time))

        current_time = end_time
        completion_times[best_proc.pid] = current_time
        unexecuted.remove(best_proc)

    return calculate_metrics(processes, completion_times, gantt, "Shortest Job First (SJF - Non-Preemptive)")


# -------------------------------------------------------------------
# 3. Priority Scheduling - Non-Preemptive
# -------------------------------------------------------------------
def priority_scheduling(processes: List[ProcessInput]) -> SimulationResult:
    """
    Priority Scheduling (Non-Preemptive):
    - Assigns a priority integer to each process (lower value = higher priority).
    - CPU is allocated to the process with the highest priority (lowest number).
    - Can lead to starvation of low-priority processes (mitigated in OS via Aging).
    """
    if not processes:
        return SimulationResult(
            algorithm="Priority", processes=[], gantt=[],
            avg_waiting_time=0.0, avg_turnaround_time=0.0,
            cpu_utilization=0.0, total_time=0
        )

    unexecuted = list(processes)
    current_time = 0
    gantt: List[GanttBlock] = []
    completion_times: Dict[str, int] = {}

    while unexecuted:
        # Find processes arrived by current_time
        arrived = [p for p in unexecuted if p.arrival_time <= current_time]

        if not arrived:
            next_arrival = min(p.arrival_time for p in unexecuted)
            gantt.append(GanttBlock(pid="IDLE", start_time=current_time, end_time=next_arrival))
            current_time = next_arrival
            continue

        # Pick process with lowest priority value (highest priority)
        best_proc = min(arrived, key=lambda p: (p.priority, p.arrival_time, p.burst_time, p.pid))

        start_time = current_time
        end_time = current_time + best_proc.burst_time
        gantt.append(GanttBlock(pid=best_proc.pid, start_time=start_time, end_time=end_time))

        current_time = end_time
        completion_times[best_proc.pid] = current_time
        unexecuted.remove(best_proc)

    return calculate_metrics(processes, completion_times, gantt, "Priority Scheduling (Non-Preemptive)")


# -------------------------------------------------------------------
# 4. Round Robin (RR) - Preemptive
# -------------------------------------------------------------------
def round_robin_scheduling(processes: List[ProcessInput], time_quantum: int = 2) -> SimulationResult:
    """
    Round Robin (RR) Scheduling:
    - Preemptive algorithm designed for time-sharing systems.
    - Each process gets a small unit of CPU time (time quantum / slice).
    - If a process does not complete within the quantum, it is preempted 
      and placed at the end of the ready queue.
    """
    if not processes:
        return SimulationResult(
            algorithm="Round Robin", quantum=time_quantum, processes=[], gantt=[],
            avg_waiting_time=0.0, avg_turnaround_time=0.0,
            cpu_utilization=0.0, total_time=0
        )

    if time_quantum <= 0:
        time_quantum = 1

    remaining_burst = {p.pid: p.burst_time for p in processes}
    proc_by_id = {p.pid: p for p in processes}
    
    # Track processes that haven't arrived yet
    unarrived = sorted(processes, key=lambda p: (p.arrival_time, p.pid))
    
    ready_queue: List[str] = []
    current_time = 0
    gantt: List[GanttBlock] = []
    completion_times: Dict[str, int] = {}
    completed_count = 0
    total_procs = len(processes)

    # Add all processes arriving at time 0
    while unarrived and unarrived[0].arrival_time <= current_time:
        ready_queue.append(unarrived.pop(0).pid)

    while completed_count < total_procs:
        if not ready_queue:
            if unarrived:
                # CPU is idle until next process arrives
                next_arrival = unarrived[0].arrival_time
                gantt.append(GanttBlock(pid="IDLE", start_time=current_time, end_time=next_arrival))
                current_time = next_arrival
                
                # Add all processes arriving at next_arrival
                while unarrived and unarrived[0].arrival_time <= current_time:
                    ready_queue.append(unarrived.pop(0).pid)
            continue

        curr_pid = ready_queue.pop(0)
        exec_time = min(remaining_burst[curr_pid], time_quantum)

        start_time = current_time
        end_time = current_time + exec_time
        gantt.append(GanttBlock(pid=curr_pid, start_time=start_time, end_time=end_time))

        remaining_burst[curr_pid] -= exec_time
        current_time = end_time

        # Check for newly arrived processes during [start_time, current_time]
        while unarrived and unarrived[0].arrival_time <= current_time:
            ready_queue.append(unarrived.pop(0).pid)

        # If current process is not finished, re-enqueue it
        if remaining_burst[curr_pid] > 0:
            ready_queue.append(curr_pid)
        else:
            completion_times[curr_pid] = current_time
            completed_count += 1

    return calculate_metrics(
        processes, completion_times, gantt, 
        f"Round Robin (Quantum = {time_quantum})", quantum=time_quantum
    )
