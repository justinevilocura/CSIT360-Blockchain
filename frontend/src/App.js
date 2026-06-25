import React, { useState, useEffect, useMemo, useCallback } from 'react';

function App() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 4;

  const API_BASE_URL = 'http://localhost:8080/api/notes';

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error(error);
      showToast('Error connecting to backend server', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const openCreateModal = () => {
    setCurrentNote(null);
    setFormTitle('');
    setFormContent('');
    setIsModalOpen(true);
  };

  const openEditModal = (note) => {
    setCurrentNote(note);
    setFormTitle(note.title);
    setFormContent(note.content || '');
    setIsModalOpen(true);
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      showToast('Please enter a note title', 'error');
      return;
    }

    const payload = {
      title: formTitle,
      content: formContent
    };

    setIsLoading(true);
    try {
      let response;
      if (currentNote) {
        response = await fetch(`${API_BASE_URL}/${currentNote.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save note');
      }

      showToast(currentNote ? 'Note updated successfully' : 'Note created successfully');
      setIsModalOpen(false);
      fetchNotes();
    } catch (error) {
      console.error(error);
      showToast('Error saving note', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (id, e) => {
    e.stopPropagation();

    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      showToast('Note deleted successfully');
      fetchNotes();
    } catch (error) {
      console.error(error);
      showToast('Error deleting note', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        (note.content && note.content.toLowerCase().includes(query))
    );
  }, [notes, searchQuery]);

  const currentNotes = useMemo(() => {
    const indexOfLastNote = currentPage * notesPerPage;
    const indexOfFirstNote = indexOfLastNote - notesPerPage;
    return filteredNotes.slice(indexOfFirstNote, indexOfLastNote);
  }, [filteredNotes, currentPage]);

  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="app-container">
      {toast && (
        <div className={`notification-banner ${toast.type === 'error' ? 'error' : ''}`}>
          {toast.type === 'error' ? (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <header className="app-header">
        <div className="brand-section">
          <h1>NOTES</h1>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openCreateModal}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Note
          </button>
        </div>
      </header>

      <div className="dashboard-controls">
        <div className="search-container">
          <svg className="search-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search notes by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading && (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="12" cy="12" r="10" strokeDasharray="40 10" />
            </svg>
            Refreshing...
          </span>
        )}
      </div>

      <div className="notes-grid">
        {currentNotes.length > 0 ? (
          currentNotes.map((note) => (
            <div key={note.id} className="note-card" onClick={() => openEditModal(note)} style={{ cursor: 'pointer' }}>
              <div className="note-card-header">
                <h4 className="note-card-title">{note.title}</h4>
              </div>
              <div className="note-card-body">
                {note.content || <em style={{ color: 'var(--text-muted)' }}>No additional content</em>}
              </div>
              <div className="note-card-footer">
                <div className="note-card-date">
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDate(note.updatedAt)}
                </div>
                <div className="note-card-actions">
                  <button
                    className="btn-icon"
                    title="Edit Note"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(note);
                    }}
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    className="btn-icon delete"
                    title="Delete Note"
                    onClick={(e) => handleDeleteNote(note.id, e)}
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3>No Notes Found</h3>
            <p>
              {searchQuery
                ? `No notes match search term "${searchQuery}"`
                : 'Create your very first note to get started.'}
            </p>
            {!searchQuery && (
              <button className="btn btn-primary" onClick={openCreateModal}>
                Create First Note
              </button>
            )}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            title="Previous Page"
          >
            &larr;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
              onClick={() => setCurrentPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}

          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            title="Next Page"
          >
            &rarr;
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{currentNote ? 'Edit Note' : 'Compose Note'}</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveNote}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="note-title">Title</label>
                  <input
                    id="note-title"
                    type="text"
                    className="form-input"
                    placeholder="E.g., Ideas for Project launch"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="note-content">Content</label>
                  <textarea
                    id="note-content"
                    className="form-textarea"
                    placeholder="Type your thoughts here..."
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
