'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [notes, setNotes] = useState<any[] | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState(''); // State for the new note title input
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [insertError, setInsertError] = useState<string | null>(null); // State for insert errors

  const supabase = createClient();

  // Function to fetch notes
  const fetchNotes = async () => {
    const { data: notesData, error: notesError } = await supabase.from('notes').select();
    if (notesError) {
      console.error('Error fetching notes:', notesError);
      setNotes([]); // Set to empty array on error
    } else {
      setNotes(notesData);
    }
  };

  // Function to fetch session
  const fetchSession = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Error fetching session:', sessionError);
      setSession(null); // Set to null on error
    } else {
      setSession(sessionData?.session || null);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchNotes();
    fetchSession();
  }, []); // Empty dependency array runs once on mount

  // Function to handle inserting a new note
  const handleInsertNote = async () => {
    setLoading(true);
    setInsertError(null); // Clear previous errors

    // Basic validation
    if (!newNoteTitle.trim()) {
      setInsertError('Note title cannot be empty.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('notes')
      .insert([
        { title: newNoteTitle }, // Insert a new row with the title from the input
      ])
      .select(); // Use select() to get the inserted data back

    if (error) {
      console.error('Error inserting note:', error);
      setInsertError(`Error inserting note: ${error.message}`);
    } else {
      console.log('Note inserted successfully:', data);
      setNewNoteTitle(''); // Clear the input field
      // Optional: Refresh the notes list after successful insert
      fetchNotes();
      // Optional: Add the new note to the current state without refetching
      // if (notes) {
      //   setNotes([...notes, ...data]);
      // } else {
      //   setNotes(data);
      // }
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      {' '}
      {/* Added some padding for better spacing */}
      <h1>Supabase Notes Example</h1>
      {/* Section for adding new notes */}
      <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h2>Add New Note</h2>
        <input
          type="text"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          placeholder="Enter note title"
          style={{ marginRight: '10px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          disabled={loading} // Disable input while loading
        />
        <button
          onClick={handleInsertNote}
          disabled={loading || !newNoteTitle.trim()} // Disable button if loading or input is empty
          style={{ padding: '8px 15px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {loading ? 'Inserting...' : 'Insert Note'}
        </button>
        {insertError && <p style={{ color: 'red', marginTop: '10px' }}>{insertError}</p>} {/* Display error message */}
      </div>
      {/* Section for displaying notes */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Notes:</h2>
        {/* Display notes */}
        {notes === null ? (
          <p>Loading notes...</p>
        ) : notes.length > 0 ? (
          <pre style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '8px', overflowX: 'auto' }}>{JSON.stringify(notes, null, 2)}</pre>
        ) : (
          <p>No notes found. Add one above!</p>
        )}
      </div>
      {/* Section for displaying session (optional) */}
      <div>
        <h2>Current Session:</h2>
        {/* Display session */}
        {session === null ? <p>Loading session or no active session found.</p> : <pre style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '8px', overflowX: 'auto' }}>{JSON.stringify(session, null, 2)}</pre>}
      </div>
    </div>
  );
}
