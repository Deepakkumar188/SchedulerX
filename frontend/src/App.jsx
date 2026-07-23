import React, { useState, useEffect, useMemo, useRef } from 'react';
import ProcessForm from './components/ProcessForm';
import GanttChart from './components/GanttChart';
import ResultsTable from './components/ResultsTable';
import SummaryCards from './components/SummaryCards';
import AlgorithmInfo from './components/AlgorithmInfo';
import ComparisonView from './components/ComparisonView';
import PlaybackControls from './components/PlaybackControls';
import ReadyQueuePanel from './components/ReadyQueuePanel';
import { runAlgorithm, compareAlgorithms } from './api';

const PALETTE = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#10b981', // emerald
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#6366f1', // indigo
];

const INITIAL_PROCESSES = [
  { pid: 'P1', arrival_time: 0, burst_time: 4, priority: 2 },
  { pid: 'P2', arrival_time: 1, burst_time: 3, priority: 1 },
  { pid: 'P3', arrival_time: 2, burst_time: 1, priority: 3 },
  { pid: 'P4', arrival_time: 5, burst_time: 2, priority: 1 },
];

export default function App() {
  const [processes, setProcesses] = useState(INITIAL_PROCESSES);
  const [quantum, setQuantum] = useState(2);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('fcfs'); // fcfs, sjf, priority, rr, compare
  const [simulationResult, setSimulationResult] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Playback timer state
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(500);

  // Assign distinct colors per process ID
  const processColors = useMemo(() => {
    const colorMap = {};
    processes.forEach((proc, idx) => {
      colorMap[proc.pid] = PALETTE[idx % PALETTE.length];
    });
    return colorMap;
  }, [processes]);

  const totalTime = simulationResult ? simulationResult.total_time : 0;

  // Timer interval effect
  useEffect(() => {
    let timer = null;
    if (isPlaying && totalTime > 0) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev + 1 >= totalTime) {
            setIsPlaying(false);
            return totalTime;
          }
          return prev + 1;
        });
      }, speedMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, totalTime, speedMs]);

  // Execute simulation when algorithm or processes change
  const handleSimulate = async () => {
    if (processes.length === 0) return;
    setLoading(true);
    setError(null);
    setIsPlaying(false);
    setCurrentTime(0);

    try {
      if (selectedAlgorithm === 'compare') {
        const compRes = await compareAlgorithms(processes, quantum);
        setComparisonData(compRes);
      } else {
        const result = await runAlgorithm(selectedAlgorithm, processes, quantum);
        setSimulationResult(result);
        setCurrentTime(0);
        setIsPlaying(true); // Autoplay simulation
      }
    } catch (err) {
      console.error('Simulation error:', err);
      setError(err.message || 'Failed to connect to backend service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSimulate();
  }, [selectedAlgorithm]);

  // Playback handlers
  const handlePlay = () => {
    if (currentTime >= totalTime) {
      setCurrentTime(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStep = () => {
    if (currentTime < totalTime) {
      setCurrentTime((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSkipToEnd = () => {
    setIsPlaying(false);
    setCurrentTime(totalTime);
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-title-group">
          <div className="header-icon">⚡</div>
          <div>
            <h1>CPU Scheduling Algorithm Simulator</h1>
            <p>Real-Time Animated OS Process Scheduling Engine & Visualizer</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="badge">FastAPI Backend</span>
          <span className="badge" style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: 'var(--accent-purple)', borderColor: 'rgba(139, 92, 246, 0.25)' }}>
            React Frontend
          </span>
        </div>
      </header>

      {/* Main Algorithm Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${selectedAlgorithm === 'fcfs' ? 'active' : ''}`}
          onClick={() => setSelectedAlgorithm('fcfs')}
        >
          FCFS (First Come)
        </button>
        <button
          className={`tab-btn ${selectedAlgorithm === 'sjf' ? 'active' : ''}`}
          onClick={() => setSelectedAlgorithm('sjf')}
        >
          SJF (Shortest Job)
        </button>
        <button
          className={`tab-btn ${selectedAlgorithm === 'priority' ? 'active' : ''}`}
          onClick={() => setSelectedAlgorithm('priority')}
        >
          Priority Scheduling
        </button>
        <button
          className={`tab-btn ${selectedAlgorithm === 'rr' ? 'active' : ''}`}
          onClick={() => setSelectedAlgorithm('rr')}
        >
          Round Robin (RR)
        </button>
        <button
          className={`tab-btn ${selectedAlgorithm === 'compare' ? 'active' : ''}`}
          onClick={() => setSelectedAlgorithm('compare')}
          style={{ background: selectedAlgorithm === 'compare' ? 'linear-gradient(135deg, var(--accent-purple), var(--accent-rose))' : undefined }}
        >
          📊 Compare All
        </button>
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            color: 'var(--accent-rose)',
            padding: '0.8rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Grid Layout */}
      <div className="main-grid">
        {/* Left Column: Form & Workload Editor */}
        <div>
          <ProcessForm
            processes={processes}
            setProcesses={setProcesses}
            quantum={quantum}
            setQuantum={setQuantum}
            selectedAlgorithm={selectedAlgorithm}
            onSimulate={handleSimulate}
            colors={processColors}
          />
        </div>

        {/* Right Column: Animated Simulation & Results */}
        <div>
          {loading ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Calculating scheduling simulation...
            </div>
          ) : selectedAlgorithm === 'compare' ? (
            <ComparisonView compareData={comparisonData} colors={processColors} />
          ) : (
            <>
              {/* Playback Control Bar */}
              {simulationResult && (
                <PlaybackControls
                  currentTime={currentTime}
                  totalTime={totalTime}
                  isPlaying={isPlaying}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onStep={handleStep}
                  onReset={handleReset}
                  onSkipToEnd={handleSkipToEnd}
                  speedMs={speedMs}
                  setSpeedMs={setSpeedMs}
                />
              )}

              {/* Ready Queue & Dispatcher State Panel */}
              {simulationResult && (
                <ReadyQueuePanel
                  processes={simulationResult.processes}
                  gantt={simulationResult.gantt}
                  currentTime={currentTime}
                  totalTime={totalTime}
                  colors={processColors}
                />
              )}

              {/* Animated Gantt Chart */}
              {simulationResult && (
                <GanttChart
                  gantt={simulationResult.gantt}
                  totalTime={totalTime}
                  currentTime={currentTime}
                  colors={processColors}
                />
              )}

              {/* Summary Cards */}
              <SummaryCards result={simulationResult} />

              {/* Results Table (Reveals as simulation progresses or finishes) */}
              {simulationResult && (
                <ResultsTable
                  processes={simulationResult.processes}
                  colors={processColors}
                />
              )}

              {/* Algorithm Explanation & Interview Notes */}
              <AlgorithmInfo algorithm={selectedAlgorithm} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
