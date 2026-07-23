/**
 * API Client helper to communicate with FastAPI backend.
 */

const API_BASE = '/api';

export async function runAlgorithm(algorithm, processes, quantum = 2) {
  let endpoint = `${API_BASE}/schedule/fcfs`;
  if (algorithm === 'sjf') endpoint = `${API_BASE}/schedule/sjf`;
  if (algorithm === 'priority') endpoint = `${API_BASE}/schedule/priority`;
  if (algorithm === 'rr') endpoint = `${API_BASE}/schedule/rr`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ processes, quantum: Number(quantum) }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'API Error' }));
    throw new Error(errorData.detail || `Server returned error ${response.status}`);
  }

  return response.json();
}

export async function compareAlgorithms(processes, quantum = 2) {
  const response = await fetch(`${API_BASE}/schedule/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ processes, quantum: Number(quantum) }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'API Error' }));
    throw new Error(errorData.detail || `Server returned error ${response.status}`);
  }

  return response.json();
}
