import React, { useContext, useEffect, useRef } from "react";
import noteContext from "../context/notes/noteContext";
import NoteItem from "./NoteItem";
import AddNote from "./AddNote";

const Notes = () => {
  const context = useContext(noteContext);
  const { notes, getNotes } = context;

  const updateNote = (note) => {
    ref.current.click();
  }
  useEffect(() => {
    getNotes();
  }, []);

  const ref = useRef(null);
  return (
    <>
      <AddNote />
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
              <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
              <button 
                type="button" 
                className="btn-close" 
                data-bs-dismiss="modal" 
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-3">
        <h2>All Notes</h2>
        {notes.map((note) => {
          return <NoteItem key={note._id} updateNote = {updateNote} note={note} />;
        })}
      </div>
    </>
  );
};

export default Notes;
