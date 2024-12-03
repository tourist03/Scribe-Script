import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5001";
  const UserNotes = [];

  const [notes, setNotes] = useState(UserNotes);
  //Get All Note
  const getNotes = async () => {
    //API call

    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc0ODI4ZTVkN2RhOTMzNjYxNzI4Zjk4In0sImlhdCI6MTczMjg2MjExNn0.qcrk2Dko4KvJ-whnWLaPAbS-RB12ljdt0ljzdNWv7Ek",
      },
    });
    const json = await response.json();
    console.log(json);

    setNotes(json);
  };

  //Add Note
  const addNote = async (title, description, tag) => {
    //API call

    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc0ODI4ZTVkN2RhOTMzNjYxNzI4Zjk4In0sImlhdCI6MTczMjg2MjExNn0.qcrk2Dko4KvJ-whnWLaPAbS-RB12ljdt0ljzdNWv7Ek",
      },
      body: JSON.stringify({ title, description, tag }),
    });

    console.log("Adding a new note");

    const note = {
      _id: "6749750d748af04c92afec02",
      user: "674828e5d7da933661728f98",
      title: title,
      description: description,
      tag: "",
      __v: 0,
    };
    setNotes(notes.concat(note));
    // setNotes([...notes , note]);
  };

  //Delete Note
  const deleteNote = async (_id) => {
    const response = await fetch(`${host}/api/notes/deletenote/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc0ODI4ZTVkN2RhOTMzNjYxNzI4Zjk4In0sImlhdCI6MTczMjg2MjExNn0.qcrk2Dko4KvJ-whnWLaPAbS-RB12ljdt0ljzdNWv7Ek",
      },
      
    });
    console.log("Note Deleting with ID :" + _id);
    const newNote = notes.filter((note) => {
      return note._id !== _id;
    });
    setNotes(newNote);
  };

  //Edit Note
  const editNote = async (id, title, description, tag) => {
    //API call

    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc0ODI4ZTVkN2RhOTMzNjYxNzI4Zjk4In0sImlhdCI6MTczMjg2MjExNn0.qcrk2Dko4KvJ-whnWLaPAbS-RB12ljdt0ljzdNWv7Ek",
      },
      body: JSON.stringify({ title, description, tag }),
    });

    for (let index = 0; index < notes.length; index++) {
      const element = notes[index];
      if (element._id === id) {
        element.title = title;
        element.description = description;
        element.tag = tag;
      }
    }
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
