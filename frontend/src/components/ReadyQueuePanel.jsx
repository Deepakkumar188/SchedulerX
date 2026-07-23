import React from 'react';
import { Cpu, ListOrdered, CheckCircle2, Clock } from 'lucide-react';

export default function ReadyQueuePanel({ processes, gantt, currentTime, totalTime, colors }) {
  if (!processes || processes.length === 0 || !gantt) return null;

  // 1. Determine currently running process block at currentTime
  let runningPid = null;
  let runningBlock = null;

  if (currentTime < totalTime) {
    runningBlock = gantt.find((b) => b.start_time <= currentTime && currentTime < b.end_time);
  } else if (totalTime > 0) {
    // Simulation finished
    runningBlock = null;
  }

  if (runningBlock) {
    runningPid = runningBlock.pid;
  }

  // 2. Classify processes based on currentTime
  const completedProcs = [];
  const readyProcs = [];
  const upcomingProcs = [];
  let currentRunningProc = null;

  processes.forEach((p) => {
    if (p.completion_time <= currentTime) {
      completedProcs.push(p);
    } else if (p.arrival_time > currentTime) {
      upcomingProcs.push(p);
    } else if (p.pid === runningPid) {
      currentRunningProc = p;
    } else {
      readyProcs.push(p);
    }
  });

  return (
    <div className="card" style={{ marginBottom: '1.25rem' }}>
      <div className="card-title" style={{ marginBottom: '0.8rem' }}>
        <span>System Execution & Ready Queue State</span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
          Real-time Process Dispatcher
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        
        {/* Column 1: Running CPU */}
        <div className="queue-card running-card">
          <div className="queue-card-header" style={{ color: 'var(--accent-blue)' }}>
            <Cpu size={15} /> RUNNING CPU
          </div>
          <div className="queue-card-body">
            {runningPid === 'IDLE' ? (
              <div className="proc-pill idle-pill">
                <span>⚡ CPU IDLE</span>
                <span className="pill-sub">No process ready</span>
              </div>
            ) : currentRunningProc ? (
              <div
                className="proc-pill running-pill"
                style={{ backgroundColor: colors[currentRunningProc.pid] || 'var(--accent-blue)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{currentRunningProc.pid}</span>
                  <span className="running-dot">● RUNNING</span>
                </div>
                <div className="pill-sub" style={{ marginTop: '0.2rem' }}>
                  Burst: {currentRunningProc.burst_time}u | Prio: {currentRunningProc.priority}
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', padding: '0.5rem 0' }}>
                {currentTime >= totalTime ? 'Simulation Finished' : 'CPU Idle'}
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Ready Queue */}
        <div className="queue-card ready-card">
          <div className="queue-card-header" style={{ color: 'var(--accent-amber)' }}>
            <ListOrdered size={15} /> READY QUEUE ({readyProcs.length})
          </div>
          <div className="queue-card-body">
            {readyProcs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', padding: '0.5rem 0' }}>
                Queue empty
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {readyProcs.map((p) => (
                  <div
                    key={p.pid}
                    className="proc-pill ready-pill"
                    style={{ borderLeft: `4px solid ${colors[p.pid] || '#3b82f6'}` }}
                  >
                    <span style={{ fontWeight: 'bold' }}>{p.pid}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      AT:{p.arrival_time} | BT:{p.burst_time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Upcoming Processes */}
        <div className="queue-card upcoming-card">
          <div className="queue-card-header" style={{ color: 'var(--text-secondary)' }}>
            <Clock size={15} /> UPCOMING ({upcomingProcs.length})
          </div>
          <div className="queue-card-body">
            {upcomingProcs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', padding: '0.5rem 0' }}>
                All processes arrived
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {upcomingProcs.map((p) => (
                  <div key={p.pid} className="proc-pill upcoming-pill">
                    <span style={{ fontWeight: 'bold' }}>{p.pid}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Arrives at t={p.arrival_time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Column 4: Completed Processes */}
        <div className="queue-card completed-card">
          <div className="queue-card-header" style={{ color: 'var(--accent-emerald)' }}>
            <CheckCircle2 size={15} /> COMPLETED ({completedProcs.length}/{processes.length})
          </div>
          <div className="queue-card-body">
            {completedProcs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', padding: '0.5rem 0' }}>
                None completed yet
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {completedProcs.map((p) => (
                  <span
                    key={p.pid}
                    className="proc-tag"
                    style={{ backgroundColor: colors[p.pid] || '#10b981', opacity: 0.85 }}
                    title={`Completed at t=${p.completion_time}`}
                  >
                    ✓ {p.pid}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
