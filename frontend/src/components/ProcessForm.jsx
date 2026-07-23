import React, { useState } from 'react';
import { Plus, Trash2, RotateCcw, Zap } from 'lucide-react';

const PRESETS = [
  {
    name: 'Standard OS Mix',
    processes: [
      { pid: 'P1', arrival_time: 0, burst_time: 5, priority: 2 },
      { pid: 'P2', arrival_time: 1, burst_time: 3, priority: 1 },
      { pid: 'P3', arrival_time: 2, burst_time: 8, priority: 4 },
      { pid: 'P4', arrival_time: 3, burst_time: 6, priority: 3 },
    ],
  },
  {
    name: 'Convoy Effect (FCFS Demo)',
    processes: [
      { pid: 'P1', arrival_time: 0, burst_time: 20, priority: 1 },
      { pid: 'P2', arrival_time: 1, burst_time: 2, priority: 2 },
      { pid: 'P3', arrival_time: 2, burst_time: 1, priority: 3 },
    ],
  },
  {
    name: 'Idle CPU Gap Demo',
    processes: [
      { pid: 'P1', arrival_time: 0, burst_time: 3, priority: 1 },
      { pid: 'P2', arrival_time: 6, burst_time: 4, priority: 2 },
      { pid: 'P3', arrival_time: 7, burst_time: 2, priority: 3 },
    ],
  },
];

export default function ProcessForm({
  processes,
  setProcesses,
  quantum,
  setQuantum,
  selectedAlgorithm,
  onSimulate,
  colors
}) {
  const [pidInput, setPidInput] = useState(`P${processes.length + 1}`);
  const [atInput, setAtInput] = useState('0');
  const [btInput, setBtInput] = useState('4');
  const [prioInput, setPrioInput] = useState('1');

  const handleAddProcess = (e) => {
    e.preventDefault();
    if (!pidInput.trim()) return;

    const newProc = {
      pid: pidInput.trim().toUpperCase(),
      arrival_time: Math.max(0, parseInt(atInput) || 0),
      burst_time: Math.max(1, parseInt(btInput) || 1),
      priority: Math.max(1, parseInt(prioInput) || 1),
    };

    // Check if PID already exists
    if (processes.some((p) => p.pid === newProc.pid)) {
      alert(`Process ID "${newProc.pid}" already exists! Please use a unique PID.`);
      return;
    }

    const updated = [...processes, newProc];
    setProcesses(updated);
    setPidInput(`P${updated.length + 1}`);
  };

  const handleDeleteProcess = (pid) => {
    setProcesses(processes.filter((p) => p.pid !== pid));
  };

  const handleLoadPreset = (presetProcesses) => {
    setProcesses(presetProcesses);
    setPidInput(`P${presetProcesses.length + 1}`);
  };

  return (
    <div className="card">
      <div className="card-title">
        <span>Process Workload Manager</span>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setProcesses([])}
          title="Clear all processes"
        >
          <RotateCcw size={14} /> Clear
        </button>
      </div>

      {/* Quick Presets */}
      <div style={{ marginBottom: '1rem' }}>
        <span className="form-label" style={{ display: 'block', marginBottom: '0.4rem' }}>
          Quick Workload Presets
        </span>
        <div className="presets-bar">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              className="preset-chip"
              onClick={() => handleLoadPreset(preset.processes)}
            >
              <Zap size={12} style={{ display: 'inline', marginRight: '3px' }} />
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Add Process Form */}
      <form onSubmit={handleAddProcess} style={{ marginBottom: '1.2rem' }}>
        <div className="input-grid">
          <div className="form-group">
            <label className="form-label">Process ID</label>
            <input
              type="text"
              className="input-field"
              value={pidInput}
              onChange={(e) => setPidInput(e.target.value)}
              placeholder="P1"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Arrival Time (AT)</label>
            <input
              type="number"
              min="0"
              className="input-field"
              value={atInput}
              onChange={(e) => setAtInput(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Burst Time (BT)</label>
            <input
              type="number"
              min="1"
              className="input-field"
              value={btInput}
              onChange={(e) => setBtInput(e.target.value)}
              required
            />
          </div>
        </div>

        {selectedAlgorithm === 'priority' && (
          <div className="form-group">
            <label className="form-label">Priority (Lower # = Higher Priority)</label>
            <input
              type="number"
              min="1"
              className="input-field"
              value={prioInput}
              onChange={(e) => setPrioInput(e.target.value)}
              required
            />
          </div>
        )}

        {selectedAlgorithm === 'rr' && (
          <div className="form-group">
            <label className="form-label">Time Quantum (Q)</label>
            <input
              type="number"
              min="1"
              className="input-field"
              value={quantum}
              onChange={(e) => setQuantum(Math.max(1, parseInt(e.target.value) || 1))}
              required
            />
          </div>
        )}

        <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '0.4rem' }}>
          <Plus size={16} /> Add Process to Queue
        </button>
      </form>

      {/* Process List Table */}
      <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
        <table className="process-input-table">
          <thead>
            <tr>
              <th>PID</th>
              <th>Arrival</th>
              <th>Burst</th>
              {selectedAlgorithm === 'priority' && <th>Prio</th>}
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {processes.length === 0 ? (
              <tr>
                <td colSpan={selectedAlgorithm === 'priority' ? 5 : 4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
                  No processes added yet. Load a preset or add processes above.
                </td>
              </tr>
            ) : (
              processes.map((p) => (
                <tr key={p.pid}>
                  <td>
                    <span
                      className="proc-tag"
                      style={{ backgroundColor: colors[p.pid] || '#3b82f6' }}
                    >
                      {p.pid}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{p.arrival_time}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{p.burst_time}</td>
                  {selectedAlgorithm === 'priority' && (
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{p.priority}</td>
                  )}
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteProcess(p.pid)}
                      title="Remove Process"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        className="btn btn-primary"
        onClick={onSimulate}
        disabled={processes.length === 0}
        style={{ width: '100%', marginTop: '1rem', opacity: processes.length === 0 ? 0.6 : 1 }}
      >
        <Zap size={18} /> Run Simulation
      </button>
    </div>
  );
}
