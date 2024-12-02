import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const UserNotes = [
    {
      _id: "6749750d748af04c92afec04",
      user: "674828e5d7da933661728f98",
      title: "ScribeSpace Script Title",
      description: "ScribeSpace Script description",
      tag: "",
      __v: 0,
    },
    {
      _id: "6749750d748af04c92afec02",
      user: "674828e5d7da933661728f98",
      title: "ScribeSpace Script Title",
      description: "ScribeSpace Script description",
      tag: "",
      __v: 0,
    },
    {
      _id: "6749750d748af04c92afec01",
      user: "674828e5d7da933661728f98",
      title: "ScribeSpace Script Title",
      description: "ScribeSpace Script description",
      tag: "",
      __v: 0,
    },
    {
      _id: "6749750d748af04c92afec07",
      user: "674828e5d7da933661728f98",
      title: "ScribeSpace Script Title",
      description: "ScribeSpace Script description",
      tag: "",
      __v: 0,
    },
    {
      _id: "6749750d748af04c92afec00",
      user: "674828e5d7da933661728f98",
      title: "ScribeSpace Script Title",
      description: "ScribeSpace Script description",
      tag: "",
      __v: 0,
    },
    {
      _id: "674975de7153ddc62ed24686",
      user: "674828e5d7da933661728f98",
      title: "ScribeSpace Script Title",
      description: "ScribeSpace Script description",
      tag: "",
      __v: 0,
    },
  ];

  const [notes, setNotes] = useState(UserNotes);
  return (
    <NoteContext.Provider value={{ notes, setNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
