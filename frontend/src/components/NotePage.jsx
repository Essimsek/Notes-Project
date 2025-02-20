import { useEffect } from "react";
import Note, { EditNote } from "./Note.jsx";
import { useContext } from "react";

import AuthContext from "../context/AuthContext";
import axios from "axios";

var backendUrl = import.meta.env.VITE_BACKEND_URL;

const NotePage = (props) => {
  const { notes, setNotes } = props;
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {

    const getNotes = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/get-all-notes`, { withCredentials: true });
        setNotes(response.data.notes.map((note) => ({
            ...note,
            editing: false
        })));
      } catch (error) {
        console.log(error); 
      }
    };
    if (isLoggedIn) getNotes();
    else setNotes([]);
  }, [isLoggedIn]);
  
  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/delete-note/${id}`, {
        withCredentials: true
      });
      setNotes((prevNotes) => {
        return prevNotes.filter((note) => note.id !== id)
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditNote = (id) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id === id) {
          return {...note, editing: !note.editing};
        }
        return note;
    }));
  };

  const handleSaveNote = async (id, title, content)  => {
    try {
      const response = await axios.patch(`${backendUrl}/api/update-note/${id}`, { title, content }, { withCredentials: true });
      const date = response.data.date;
      setNotes(notes.map((note) => {
        if (id === note.id) {
          return {...note, title, content, date, editing: false};
        }
        return note
      }))
    } catch {
      console.log("Error saving note");
    }
  };

  return (
      <div className="flex flex-wrap w-11/12 ml-12 my-auto p-8 min-h-screen justify-center content-start gap-4 notebook-bg shadow-lg rounded">
        {isLoggedIn && !notes.length && <h1 className="text-2xl font-bold text-center w-full">Start creating your notes.</h1>}
        {notes.map((note) => (
          note.editing ? <EditNote key={note.id} 
          title={note.title} 
          content={note.content} 
          color={note.color}
          id={note.id}
          date={note.date}
          onCancel={handleEditNote}
          onSave={handleSaveNote}
          />
          : <Note key={note.id}
          title={note.title} 
          content={note.content} 
          color={note.color}
          date={note.date}
          id={note.id}
          onDelete={handleDeleteNote}
          onEdit={handleEditNote}
          />
        ))}
      </div>
  );
}

export default NotePage;
