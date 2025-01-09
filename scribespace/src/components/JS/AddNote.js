import React, { useContext, useState } from "react";
import noteContext from "../../context/notes/noteContext";
import "../CSS/AddNote.css"; // Import the new CSS file

const AddNote = ({ showAlert }) => {
  const context = useContext(noteContext);
  const { addNote } = context;

  const [note, setNote] = useState({ title: "", description: "", tag: "" });

  const handleClick = (e) => {
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    setNote({ title: "", description: "", tag: "" });
    showAlert("Note added successfully", "success");
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <div className="add-note-container">
      <div className="note-form-container">
        <h2 className="note-header">ScribeSpace - Add Note</h2>
        <form className="note-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-input"
              id="title"
              name="title"
              placeholder="Enter title (minimum 4 characters)"
              onChange={onChange}
              value={note.title}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-input"
              id="description"
              name="description"
              rows="4"
              placeholder="Enter description (minimum 5 characters)"
              onChange={onChange}
              value={note.description}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tag" className="form-label">
              Tag
            </label>
            <input
              type="text"
              className="form-input"
              id="tag"
              name="tag"
              placeholder="Enter tags"
              onChange={onChange}
              value={note.tag}
            />
          </div>

          <button
            type="submit"
            onClick={handleClick}
            className={`submit-button ${
              note.title.length < 4 || note.description.length < 5
                ? "button-disabled"
                : ""
            }`}
            disabled={note.title.length < 4 || note.description.length < 5}
          >
            Add Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNote;
