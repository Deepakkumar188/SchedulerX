import React from 'react';

export default function GanttChart({ gantt, totalTime, currentTime, colors }) {
  if (!gantt || gantt.length === 0 || totalTime === 0) {
    return (
      <div className="card">
        <div className="card-title">Gantt Chart Timeline</div>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Run the simulation to generate the CPU execution timeline.
        </div>
      </div>
    );
  }

  // Use currentTime if provided, otherwise render full duration
  const activeTime = currentTime !== undefined && currentTime !== null ? currentTime : totalTime;

  // Extract all time tick points up to activeTime (plus 0)
  const timeTicks = [0];
  gantt.forEach((block) => {
    if (block.end_time <= activeTime && !timeTicks.includes(block.end_time)) {
      timeTicks.push(block.end_time);
    }
  });

  if (activeTime > 0 && !timeTicks.includes(activeTime) && activeTime <= totalTime) {
    timeTicks.push(activeTime);
  }
  timeTicks.sort((a, b) => a - b);

  return (
    <div className="card gantt-wrapper">
      <div className="card-title">
        <span>CPU Execution Gantt Chart</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
          Simulated Clock: <strong style={{ color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>t = {activeTime}</strong> / {totalTime} units
        </span>
      </div>

      {/* Gantt Timeline Track */}
      <div className="gantt-track" style={{ position: 'relative' }}>
        {gantt.map((block, idx) => {
          const fullDuration = block.end_time - block.start_time;

          // Block hasn't started yet
          if (activeTime <= block.start_time) {
            return (
              <div
                key={idx}
                className="gantt-block empty-future-block"
                style={{ flex: fullDuration }}
                title={`Upcoming: ${block.pid} (${block.start_time} - ${block.end_time})`}
              >
                <span style={{ opacity: 0.3, fontSize: '0.75rem' }}>{block.pid}</span>
              </div>
            );
          }

          // Block is currently executing
          const isCurrentlyRunning = activeTime > block.start_time && activeTime < block.end_time;
          const visibleDuration = isCurrentlyRunning
            ? activeTime - block.start_time
            : Math.min(fullDuration, Math.max(0, activeTime - block.start_time));

          const isIdle = block.pid === 'IDLE';
          const bgColor = isIdle ? undefined : colors[block.pid] || '#3b82f6';

          return (
            <React.Fragment key={idx}>
              <div
                className={`gantt-block ${isIdle ? 'idle' : ''} ${isCurrentlyRunning ? 'running-active-block' : ''}`}
                style={{
                  flex: visibleDuration,
                  backgroundColor: isIdle ? undefined : bgColor,
                }}
                title={`${block.pid}: ${block.start_time} ➔ ${block.start_time + visibleDuration} (${visibleDuration}/${fullDuration}u)`}
              >
                <span style={{ fontSize: '0.85rem' }}>{block.pid}</span>
                <span style={{ fontSize: '0.62rem', opacity: 0.8, fontWeight: 'normal' }}>
                  [{visibleDuration}u]
                </span>
                {isCurrentlyRunning && <div className="running-pulse-indicator" />}
              </div>

              {/* If block is currently running, render remaining unexecuted duration as dim block */}
              {isCurrentlyRunning && fullDuration > visibleDuration && (
                <div
                  className="gantt-block empty-future-block"
                  style={{ flex: fullDuration - visibleDuration }}
                >
                  <span style={{ opacity: 0.3, fontSize: '0.65rem' }}>...</span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Time scale ticks */}
      <div className="gantt-time-scale">
        {timeTicks.map((time, idx) => {
          const percentage = (time / totalTime) * 100;
          return (
            <div
              key={idx}
              className="time-tick"
              style={{ left: `${percentage}%` }}
            >
              <span>{time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
