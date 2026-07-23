import React from 'react';
import { Play, Pause, SkipForward, RotateCcw, FastForward } from 'lucide-react';

export default function PlaybackControls({
  currentTime,
  totalTime,
  isPlaying,
  onPlay,
  onPause,
  onStep,
  onReset,
  onSkipToEnd,
  speedMs,
  setSpeedMs,
}) {
  const isFinished = currentTime >= totalTime && totalTime > 0;

  return (
    <div className="card playback-card" style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Time Counter & Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="time-display-box">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Simulated Time
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>
              t = {currentTime} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ {totalTime}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ width: '140px', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: totalTime > 0 ? `${(currentTime / totalTime) * 100}%` : '0%',
                  background: 'linear-gradient(to right, var(--accent-blue), var(--accent-purple))',
                  transition: 'width 0.15s ease',
                }}
              />
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              {totalTime > 0 ? `${Math.round((currentTime / totalTime) * 100)}%` : '0%'}
            </span>
          </div>
        </div>

        {/* Playback Button Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onReset}
            title="Reset to t = 0"
          >
            <RotateCcw size={15} /> Reset
          </button>

          {isPlaying ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={onPause}
              style={{ background: 'linear-gradient(135deg, var(--accent-amber), #d97706)' }}
            >
              <Pause size={16} /> Pause
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={onPlay}
              disabled={isFinished}
              style={{ opacity: isFinished ? 0.6 : 1 }}
            >
              <Play size={16} /> {isFinished ? 'Completed' : 'Play'}
            </button>
          )}

          <button
            className="btn btn-secondary btn-sm"
            onClick={onStep}
            disabled={isFinished || isPlaying}
            title="Advance 1 time unit"
          >
            <SkipForward size={15} /> Step +1
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={onSkipToEnd}
            disabled={isFinished}
            title="Skip to completion"
          >
            <FastForward size={15} /> End
          </button>
        </div>

        {/* Speed Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
            Speed:
          </span>
          <select
            className="input-field"
            style={{ width: 'auto', padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
            value={speedMs}
            onChange={(e) => setSpeedMs(Number(e.target.value))}
          >
            <option value={1000}>0.5x (Slow)</option>
            <option value={500}>1.0x (Normal)</option>
            <option value={250}>2.0x (Fast)</option>
            <option value={100}>4.0x (Turbo)</option>
          </select>
        </div>

      </div>
    </div>
  );
}
