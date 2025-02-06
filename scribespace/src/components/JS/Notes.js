import React, { useContext, useEffect, useRef, useState } from "react";
import noteContext from "../../context/notes/noteContext";
import NoteItem from "./NoteItem";
import AddNote from "./AddNote";
import { useNavigate } from "react-router-dom";
import '../CSS/Notes.css';
import { PenLine, FileText } from "lucide-react";
import { EMPTY_NOTES_SVG } from '../../constants/illustrations';
import ConfirmationModal from './ConfirmationModal';

const Notes = (props) => {
  const navigate = useNavigate();
  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [note, setNote] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etag: "",
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getNotes();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  const updateNote = (currentNote) => {
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
    });
    setIsModalOpen(true);
  };

  const handleClick = () => {
    editNote(note.id, note.etitle, note.edescription, note.etag);
    setIsModalOpen(false);
    props.showAlert("Note updated successfully", "warning");
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const refreshNotes = async () => {
    if (localStorage.getItem("token")) {
      await getNotes();
    }
  };

  return (
    <div className="notes-flex-container">
      <div className="add-note-section">
        <AddNote showAlert={props.showAlert} onNoteAdded={refreshNotes} />
      </div>

      <div className="all-notes-section">
        <h2>All Notes</h2>
        <div className="notes-grid">
          {notes.length > 0 ? (
            Array.isArray(notes) && notes.map((note) => {
              return (
                <NoteItem
                  key={note._id}
                  updateNote={updateNote}
                  showAlert={props.showAlert}
                  note={note}
                />
              );
            })
          ) : (
            <div className="empty-state">
              <div className="empty-state-content">
                <div 
                  className="empty-state-image"
                  dangerouslySetInnerHTML={{ __html: EMPTY_NOTES_SVG }}
                />
                <h2>Start Writing!</h2>
                <p>Create your first note to get started!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Note"
        message={
          <form className="my-3">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                id="etitle"
                name="etitle"
                value={note.etitle}
                onChange={onChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                id="edescription"
                name="edescription"
                value={note.edescription}
                onChange={onChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="tag" className="form-label">Tag</label>
              <input
                type="text"
                className="form-control"
                id="etag"
                name="etag"
                value={note.etag}
                onChange={onChange}
              />
            </div>
          </form>
        }
        onConfirm={handleClick}
        showAuthButtons={false}
      />
    </div>
  );
};

export default Notes;
