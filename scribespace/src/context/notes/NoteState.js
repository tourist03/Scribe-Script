import NoteContext from "./noteContext";
import { useState, useEffect } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5001";
  const [notes, setNotes] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Modify getNotes to be more robust
  const getNotes = async (forceRefresh = false) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "auth-token": token,
        },
        cache: forceRefresh ? 'no-cache' : 'default'
      });

      if (response.ok) {
        const json = await response.json();
        if (Array.isArray(json)) {
          setNotes(json);
          setIsInitialized(true);
        }
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setNotes([]);
    }
  };

  // Modify addNote to ensure immediate state update
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
      
      if (response.ok) {
        const newNote = await response.json();
        setNotes(prevNotes => [...prevNotes, newNote]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding note:", error);
      return false;
    }
  };

  // Add a proper initialization function
  const initializeNotes = async () => {
    if (!isInitialized) {
      await getNotes(true);
    }
  };

  // Watch for auth changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isInitialized) {
      initializeNotes();
    }
  }, [isInitialized]);

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
      value={{ 
        notes, 
        addNote, 
        deleteNote, 
        editNote, 
        getNotes,
        initializeNotes,
        isInitialized 
      }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
