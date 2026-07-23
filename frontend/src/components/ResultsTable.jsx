import React from 'react';

export default function ResultsTable({ processes, colors }) {
  if (!processes || processes.length === 0) return null;

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div className="card-title">Process Simulation Results</div>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Process</th>
              <th>Arrival (AT)</th>
              <th>Burst (BT)</th>
              <th>Priority</th>
              <th>Completion (CT)</th>
              <th>Turnaround (TAT = CT - AT)</th>
              <th>Waiting (WT = TAT - BT)</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p) => (
              <tr key={p.pid}>
                <td>
                  <span
                    className="proc-tag"
                    style={{ backgroundColor: colors[p.pid] || '#3b82f6' }}
                  >
                    {p.pid}
                  </span>
                </td>
                <td>{p.arrival_time}</td>
                <td>{p.burst_time}</td>
                <td>{p.priority}</td>
                <td style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{p.completion_time}</td>
                <td style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>{p.turnaround_time}</td>
                <td style={{ color: 'var(--accent-amber)', fontWeight: 'bold' }}>{p.waiting_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
