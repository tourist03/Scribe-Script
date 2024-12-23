import { useContext } from "react";
import React from "react";
import noteContext from "../context/notes/noteContext";

const NoteItem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note, updateNote, showAlert } = props;

  const handleDelete = () => {
    deleteNote(note._id);
    showAlert("Note deleted successfully", "success");
  };

  return (
    <div className="note-item">
      <div className="card-body position-relative">
        <div className="position-absolute top-0 end-0 mt-2 me-2">
          <i
            className="fa-duotone fa-regular fa-trash-can my-2 mx-3"
            style={{ color: "#594fa1" }}
            onClick={handleDelete}
          ></i>
          <i
            className="fa-duotone fa-solid fa-user-pen mx-1"
            style={{ color: "#5021c0" }}
            onClick={() => {
              updateNote(note);
            }}
          ></i>
        </div>
        <h5 className="card-title">{note.title}</h5>
        <p className="card-text">{note.description}</p>
      </div>
    </div>
  );
};

export default NoteItem;
