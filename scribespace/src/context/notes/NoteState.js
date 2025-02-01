import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5001";
  const UserNotes = [];

  const [notes, setNotes] = useState(UserNotes);
  //Get All Note
  const getNotes = async () => {
    const token = localStorage.getItem('token');
    //console.log('Token:', token);

    if (!token) {
      //console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "auth-token": token,
        },
      });

      const json = await response.json();
      //console.log('Response:', json);

      if (Array.isArray(json)) {
        setNotes(json);
      } else {
        setNotes([]);
        //console.error('Received non-array data:', json);
      }
    } catch (error) {
      //console.error('Error fetching notes:', error);
      setNotes([]);
    }
  };

  //Add Note
  const addNote = async (title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
        },
        body: JSON.stringify({ title, description, tag }),
      });

      const note = await response.json();
      
      // Check if the response is successful and contains a valid note
      if (note && !note.error) {
        // Use spread operator to safely add the new note
        setNotes(prevNotes => [...prevNotes, note]);
      } else {
        //console.error('Failed to add note:', note);
      }
    } catch (error) {
      //console.error('Error adding note:', error);
    }
  };

  //Delete Note
  const deleteNote = async (_id) => {
    const response = await fetch(`${host}/api/notes/deletenote/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('token'),
      },
    });
    //console.log("Note Deleting with ID :" + _id);
    const newNote = notes.filter((note) => {
      return note._id !== _id;
    });
    const json = await response.json();
    //console.log(json);
    // eslint-disable-next-line
    setNotes(newNote);
  };
  // eslint-disable-next-line

  //Edit Note
  const editNote = async (id, title, description, tag) => {
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token'),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    // eslint-disable-next-line
    //console.log(json);

    let newNote = JSON.parse(JSON.stringify(notes));

    for (let index = 0; index < notes.length; index++) {
      const element = newNote[index];
      if (element._id === id) {
        newNote[index].title = title;
        newNote[index].description = description;
        newNote[index].tag = tag;
        break;
      }
    }
    setNotes(newNote);
  };

  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
