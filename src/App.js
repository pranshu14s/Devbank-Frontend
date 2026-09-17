import React, { useEffect, useState } from 'react';

// This is set at BUILD time (in the Docker build / CodeBuild step) via
// an environment variable. It points at the backend service's public URL
// (the backend ALB DNS name, once we deploy it).
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    fetch(`${API_URL}/api/accounts`)
      .then(res => res.json())
      .then(data => {
        setAccounts(data);
        setStatus('loaded');
      })
      .catch(err => {
        console.error(err);
        setStatus('error');
      });
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: 600, margin: '40px auto', padding: 20 }}>
      <h1>DevBank</h1>
      <p style={{ color: '#666' }}>Digital Banking Platform — Frontend (React)</p>

      {status === 'loading' && <p>Loading accounts...</p>}
      {status === 'error' && (
        <p style={{ color: 'red' }}>
          Could not reach backend API at {API_URL}. Check the backend service is running.
        </p>
      )}

      {status === 'loaded' && (
        <div>
          {accounts.map(acc => (
            <div key={acc.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 12 }}>
              <h3>{acc.name}</h3>
              <p style={{ fontSize: 24, margin: 0 }}>${acc.balance.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
