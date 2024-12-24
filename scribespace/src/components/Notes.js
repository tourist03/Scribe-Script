import React, { useContext, useEffect, useRef, useState } from "react";
import noteContext from "../context/notes/noteContext";
import NoteItem from "./NoteItem";
import AddNote from "./AddNote";
import { useNavigate } from "react-router-dom";
import './CSS/Notes.css'; // Ensure this is imported

const Notes = (props) => {
  let navigate = useNavigate();
  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;

  const [note, setNote] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etag: "",
  });

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
    });
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getNotes();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  const ref = useRef(null);
  const refClose = useRef(null);

  const handleClick = (e) => {
    editNote(note.id, note.etitle, note.edescription, note.etag);
    refClose.current.click();
    props.showAlert("note updated successfully", "warning");
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <div className="notes-container"> {/* Common container */}
      <div className="notes-flex-container"> {/* New flex container */}
        <div className="add-note-section"> {/* Section for adding notes */}
          <AddNote showAlert={props.showAlert} />
        </div>

        <div className="all-notes-section"> {/* Section for displaying all notes */}
          <h2>All Notes</h2>
          <div className="container"> {/* Flex container for notes */}
            {(!notes || notes.length === 0) && "Create your first note now"}
            <div className="notes-grid"> {/* New grid for notes */}
              {Array.isArray(notes) && notes.map((note) => {
                return (
                  <NoteItem
                    key={note._id}
                    updateNote={updateNote}
                    showAlert={props.showAlert}
                    note={note}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        ref={ref}
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Note
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="my-3">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
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
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
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
                  <label htmlFor="tag" className="form-label">
                    Tag
                  </label>
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
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                ref={refClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleClick}
                disabled={
                  note.etitle.length < 4 || note.edescription.length < 5
                }
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
