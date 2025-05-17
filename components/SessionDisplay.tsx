// components/SessionDisplay.tsx
'use client';

import useSession from '@/hooks/useSession'; // Import the hook

const SessionDisplay: React.FC = () => {
  const session = useSession(); // Use the hook to get the session

  return (
    <div>
      <h2>Current Session:</h2>
      {session === null ? (
        <p>Loading session or no active session found.</p>
      ) : (
        <pre
          style={{
            backgroundColor: '#f0f0f0',
            padding: '15px',
            borderRadius: '8px',
            overflowX: 'auto',
          }}
        >
          {JSON.stringify(session, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default SessionDisplay;
