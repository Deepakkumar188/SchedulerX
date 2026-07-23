import React from 'react';
import { BookOpen, HelpCircle } from 'lucide-react';

const ALGO_DETAILS = {
  fcfs: {
    title: 'First-Come, First-Served (FCFS)',
    type: 'Non-Preemptive',
    desc: 'Processes are assigned the CPU in the order of their arrival in the ready queue.',
    formula: 'Turnaround Time (TAT) = Completion Time - Arrival Time\nWaiting Time (WT) = Turnaround Time - Burst Time',
    pros: 'Simple to understand and implement using a FIFO queue.',
    cons: 'Convoy Effect: Short processes must wait behind long CPU-bound processes, leading to high average waiting time.',
    interviewTip: 'Mention Convoy Effect and FIFO queue implementation when discussing FCFS.',
  },
  sjf: {
    title: 'Shortest Job First (SJF)',
    type: 'Non-Preemptive',
    desc: 'Assigns CPU to the process with the smallest CPU burst time among all arrived processes.',
    formula: 'Optimal for minimizing average waiting time for a given fixed set of processes.',
    pros: 'Gives the minimum average waiting time among all scheduling algorithms.',
    cons: 'Starvation: Long processes may wait indefinitely if short processes arrive continuously. CPU burst time is difficult to predict in real OS.',
    interviewTip: 'Highlight that SJF is provably optimal for minimizing Average Waiting Time.',
  },
  priority: {
    title: 'Priority Scheduling',
    type: 'Non-Preemptive',
    desc: 'Each process is assigned a priority (here lower numerical value = higher priority). CPU is given to the process with highest priority.',
    formula: 'Priority 1 > Priority 2 > Priority 3',
    pros: 'Allows high-priority critical tasks (e.g. system interrupt handlers) to execute before low-priority user tasks.',
    cons: 'Starvation (Indefinite Blocking): Low priority processes may never execute. Solution in production OS: Aging (gradually increasing priority of waiting processes).',
    interviewTip: 'Always mention Aging as the standard OS mechanism to prevent starvation in Priority scheduling.',
  },
  rr: {
    title: 'Round Robin (RR)',
    type: 'Preemptive',
    desc: 'Designed for time-sharing systems. Each process is allocated a small fixed time quantum (Q). If not completed, it is preempted to back of ready queue.',
    formula: 'Performance strongly depends on Time Quantum Q size.\nIf Q is very large ➔ behaves like FCFS.\nIf Q is very small ➔ context switch overhead dominates.',
    pros: 'Fair allocation, fast response time for interactive processes, prevents starvation.',
    cons: 'High context switching overhead if time quantum is too small relative to context switch time.',
    interviewTip: 'Discuss the trade-off between Quantum size and Context Switch overhead.',
  },
};

export default function AlgorithmInfo({ algorithm }) {
  const info = ALGO_DETAILS[algorithm] || ALGO_DETAILS.fcfs;

  return (
    <div className="info-box">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
          <BookOpen size={16} /> {info.title}
        </h4>
        <span className="badge">{info.type}</span>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{info.desc}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
          <strong style={{ color: 'var(--accent-emerald)', fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem' }}>
            ✓ Key Advantage
          </strong>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{info.pros}</span>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
          <strong style={{ color: 'var(--accent-rose)', fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem' }}>
            ⚠ Drawback / Trade-off
          </strong>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{info.cons}</span>
        </div>
      </div>

      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <strong style={{ color: 'var(--accent-amber)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <HelpCircle size={14} /> Interview Cheat Sheet Tip:
        </strong>{' '}
        {info.interviewTip}
      </div>
    </div>
  );
}
