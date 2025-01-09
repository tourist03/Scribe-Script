import { useContext } from "react";
import React from "react";
import noteContext from "../../context/notes/noteContext";

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
        <div
          className="position-absolute"
          style={{
            top: '0',
            right: '0',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '0.5rem',
            width: '50px',
          }}
        >
          <i
            className="fa-duotone fa-regular fa-trash-can mx-2"
            style={{ color: "#594fa1", cursor: "pointer" }}
            onClick={handleDelete}
          ></i>
          <i
            className="fa-duotone fa-solid fa-user-pen mx-2"
            style={{ color: "#5021c0", cursor: "pointer" }}
            onClick={() => updateNote(note)}
          ></i>
        </div>
        <h5
          className="card-title"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "calc(100% - 60px)", // Adjust spacing for icons
          }}
        >
          {note.title}
        </h5>
        <p className="card-text">{note.description}</p>
      </div>
    </div>
  );
};

export default NoteItem;
