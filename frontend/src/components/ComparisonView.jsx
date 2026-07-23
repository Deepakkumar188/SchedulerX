import React from 'react';
import GanttChart from './GanttChart';
import { Award } from 'lucide-react';

export default function ComparisonView({ compareData, colors }) {
  if (!compareData) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Run comparison to view side-by-side performance of all 4 CPU scheduling algorithms.
      </div>
    );
  }

  const { fcfs, sjf, priority, rr } = compareData;

  const algos = [
    { key: 'fcfs', name: 'FCFS', data: fcfs },
    { key: 'sjf', name: 'SJF (Non-Preemptive)', data: sjf },
    { key: 'priority', name: 'Priority (Non-Preemptive)', data: priority },
    { key: 'rr', name: `Round Robin (Q=${rr.quantum || 2})`, data: rr },
  ];

  // Determine best algorithm for Avg Waiting Time
  const minAvgWT = Math.min(...algos.map((a) => a.data.avg_waiting_time));

  return (
    <div>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award color="var(--accent-amber)" size={20} />
          Algorithm Performance Comparison Matrix
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Avg Waiting Time (WT)</th>
                <th>Avg Turnaround Time (TAT)</th>
                <th>CPU Utilization</th>
                <th>Total Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {algos.map((item) => {
                const isBestWT = item.data.avg_waiting_time === minAvgWT;
                return (
                  <tr key={item.key}>
                    <td style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{item.name}</td>
                    <td style={{ color: isBestWT ? 'var(--accent-emerald)' : 'var(--text-primary)', fontWeight: 'bold' }}>
                      {item.data.avg_waiting_time} units
                    </td>
                    <td>{item.data.avg_turnaround_time} units</td>
                    <td style={{ color: 'var(--accent-emerald)' }}>{item.data.cpu_utilization}%</td>
                    <td>{item.data.total_time} units</td>
                    <td>
                      {isBestWT ? (
                        <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                          Lowest Waiting Time
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Standard</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-title" style={{ marginBottom: '1rem', marginTop: '1.5rem' }}>
        Comparative Execution Timelines
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {algos.map((item) => (
          <div key={item.key}>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--accent-blue)', marginBottom: '0.4rem' }}>
              {item.name} Timeline
            </div>
            <GanttChart
              gantt={item.data.gantt}
              totalTime={item.data.total_time}
              colors={colors}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
