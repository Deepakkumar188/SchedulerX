import React from 'react';
import { Clock, CheckCircle, Cpu, Hourglass } from 'lucide-react';

export default function SummaryCards({ result }) {
  if (!result) return null;

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Hourglass size={14} color="var(--accent-amber)" /> Average Waiting Time
        </div>
        <div className="metric-value" style={{ color: 'var(--accent-amber)' }}>
          {result.avg_waiting_time} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>units</span>
        </div>
        <div className="metric-sub">Sum of waiting times / Process count</div>
      </div>

      <div className="metric-card">
        <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Clock size={14} color="var(--accent-blue)" /> Avg Turnaround Time
        </div>
        <div className="metric-value" style={{ color: 'var(--accent-blue)' }}>
          {result.avg_turnaround_time} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>units</span>
        </div>
        <div className="metric-sub">Sum of turnaround times / Process count</div>
      </div>

      <div className="metric-card">
        <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Cpu size={14} color="var(--accent-emerald)" /> CPU Utilization
        </div>
        <div className="metric-value" style={{ color: 'var(--accent-emerald)' }}>
          {result.cpu_utilization}%
        </div>
        <div className="metric-sub">Busy time / Total schedule duration</div>
      </div>

      <div className="metric-card">
        <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle size={14} color="var(--accent-purple)" /> Total Schedule Time
        </div>
        <div className="metric-value" style={{ color: 'var(--accent-purple)' }}>
          {result.total_time} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>units</span>
        </div>
        <div className="metric-sub">Completion time of last process</div>
      </div>
    </div>
  );
}
