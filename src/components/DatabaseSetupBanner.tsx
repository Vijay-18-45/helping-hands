import { useState } from 'react';

const RULES = `{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "donations": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}`;

export default function DatabaseSetupBanner() {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(RULES).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (collapsed) {
    return (
      <div style={{
        background: '#fef3c7', border: '1px solid #f59e0b',
        borderRadius: 10, padding: '10px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: '0.875rem', color: '#92400e',
      }}>
        <span>⚠️ Firebase Realtime Database rules need to be configured before registering.</span>
        <button onClick={() => setCollapsed(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b45309', fontWeight: 600, fontSize: '0.875rem' }}>
          Show guide
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: '#fffbeb', border: '2px solid #f59e0b',
      borderRadius: 12, padding: '20px 24px', marginBottom: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#f59e0b">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
          <strong style={{ color: '#92400e', fontSize: '1rem' }}>Firebase Database Setup Required</strong>
        </div>
        <button onClick={() => setCollapsed(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400e', opacity: 0.6, fontSize: '1.25rem', lineHeight: 1, padding: 0 }}>
          ×
        </button>
      </div>

      <p style={{ color: '#78350f', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 16 }}>
        Your Firebase Realtime Database rules are blocking reads and writes. Follow these steps to fix it:
      </p>

      <ol style={{ color: '#78350f', fontSize: '0.875rem', lineHeight: 1.8, paddingLeft: 20, marginBottom: 16 }}>
        <li>Go to the <strong>Firebase Console</strong> → select your project <strong>helping-hands-7f9b6</strong></li>
        <li>Click <strong>Realtime Database</strong> in the left sidebar</li>
        <li>Click the <strong>Rules</strong> tab at the top</li>
        <li>Replace the existing rules with the following, then click <strong>Publish</strong>:</li>
      </ol>

      <div style={{ position: 'relative', background: '#1e1e2e', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>firebase-rtdb-rules.json</span>
          <button onClick={copy} style={{
            background: copied ? '#10b981' : 'rgba(255,255,255,0.1)',
            border: 'none', borderRadius: 6, color: 'white',
            padding: '4px 12px', fontSize: '0.75rem', cursor: 'pointer',
            transition: 'background 0.2s', fontWeight: 600,
          }}>
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        <pre style={{ margin: 0, padding: '14px 18px', color: '#a6e3a1', fontSize: '0.8125rem', lineHeight: 1.7, overflowX: 'auto', fontFamily: 'monospace' }}>
          {RULES}
        </pre>
      </div>
    </div>
  );
}
