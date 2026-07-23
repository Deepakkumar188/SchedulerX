"""
Unit tests for CPU Scheduling Algorithms
Run with: pytest backend/test_scheduling.py
"""

from scheduling import (
    ProcessInput,
    fcfs_scheduling,
    sjf_scheduling,
    priority_scheduling,
    round_robin_scheduling
)


def test_fcfs_basic():
    processes = [
        ProcessInput(pid="P1", arrival_time=0, burst_time=4, priority=2),
        ProcessInput(pid="P2", arrival_time=1, burst_time=3, priority=1),
        ProcessInput(pid="P3", arrival_time=2, burst_time=1, priority=3),
        ProcessInput(pid="P4", arrival_time=5, burst_time=2, priority=1),
    ]

    res = fcfs_scheduling(processes)

    assert res.avg_turnaround_time == 5.25
    assert res.avg_waiting_time == 2.75
    assert res.total_time == 10
    assert len(res.processes) == 4

    p1_res = next(p for p in res.processes if p.pid == "P1")
    assert p1_res.completion_time == 4
    assert p1_res.turnaround_time == 4
    assert p1_res.waiting_time == 0


def test_fcfs_with_idle_gap():
    processes = [
        ProcessInput(pid="P1", arrival_time=0, burst_time=2),
        ProcessInput(pid="P2", arrival_time=5, burst_time=3),
    ]

    res = fcfs_scheduling(processes)

    # Gantt should have P1 (0..2), IDLE (2..5), P2 (5..8)
    assert len(res.gantt) == 3
    assert res.gantt[1].pid == "IDLE"
    assert res.gantt[1].start_time == 2
    assert res.gantt[1].end_time == 5
    assert res.cpu_utilization == 62.5  # 5 busy units / 8 total units = 62.5%


def test_sjf_non_preemptive():
    processes = [
        ProcessInput(pid="P1", arrival_time=0, burst_time=7),
        ProcessInput(pid="P2", arrival_time=2, burst_time=4),
        ProcessInput(pid="P3", arrival_time=4, burst_time=1),
        ProcessInput(pid="P4", arrival_time=5, burst_time=4),
    ]

    res = sjf_scheduling(processes)
    # Execution order: P1 (0..7). At t=7, arrived are P2 (BT 4), P3 (BT 1), P4 (BT 4).
    # SJF picks P3 (7..8), then P2 (8..12), then P4 (12..16).
    gantt_pids = [b.pid for b in res.gantt]
    assert gantt_pids == ["P1", "P3", "P2", "P4"]


def test_priority_non_preemptive():
    processes = [
        ProcessInput(pid="P1", arrival_time=0, burst_time=4, priority=3),
        ProcessInput(pid="P2", arrival_time=1, burst_time=3, priority=1),
        ProcessInput(pid="P3", arrival_time=2, burst_time=2, priority=2),
    ]

    res = priority_scheduling(processes)
    # At t=0: P1 runs (0..4). At t=4, P2 (Prio 1) and P3 (Prio 2) are waiting.
    # Pick P2 (4..7), then P3 (7..9).
    gantt_pids = [b.pid for b in res.gantt]
    assert gantt_pids == ["P1", "P2", "P3"]


def test_round_robin():
    processes = [
        ProcessInput(pid="P1", arrival_time=0, burst_time=5),
        ProcessInput(pid="P2", arrival_time=1, burst_time=3),
    ]

    res = round_robin_scheduling(processes, time_quantum=2)
    # t=0: P1 runs (0..2), rem P1=3. Ready Q: [P2]. At t=2, P1 re-enqueued: [P2, P1]
    # t=2: P2 runs (2..4), rem P2=1. Ready Q: [P1, P2]
    # t=4: P1 runs (4..6), rem P1=1. Ready Q: [P2, P1]
    # t=6: P2 runs (6..7), rem P2=0 (done). Ready Q: [P1]
    # t=7: P1 runs (7..8), rem P1=0 (done).
    gantt_pids = [b.pid for b in res.gantt]
    assert gantt_pids == ["P1", "P2", "P1", "P2", "P1"]
