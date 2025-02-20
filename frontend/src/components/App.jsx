import Footer from "./Footer.jsx";
import Sidebar from "./SideBar.jsx";
import { v4 as uuidv4 } from 'uuid';
import NotePage from "./NotePage.jsx";
import { useState, useContext } from "react";

import AuthContext from "../context/AuthContext";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const colors = ["bg-red-400", "bg-blue-400", "bg-yellow-400", "bg-green-400", "bg-purple-400", "bg-pink-400", "bg-indigo-400", "bg-teal-400"];

const App = () => {
  const [notes, setNotes] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);

  const addNewNote = async () => {

    if (isLoggedIn) {
      const title = "";
      const content = "";
      const color = colors[Math.floor(Math.random() * colors.length)];
      try {
        const response = await axios.post(`${backendUrl}/api/add-note`, { title, content, color }, { withCredentials: true});
        const newNote = {
          id: response.data.id,
          title: "",
          content: "",
          color: color,
          date: response.data.date,
          editing: true,
        };
        setNotes((prevNotes) => [newNote, ...prevNotes]);
      } catch (err) {
        console.log(err);
      }
    }

    else {
      alert("Please login to add a note");
    }
  };

  return (
    <>
      <div className="flex p-4 gap-2 justify-center">
          <Sidebar handleAddNote={addNewNote} />
          <NotePage notes={notes} setNotes={setNotes} />
      </div>
      {/*<Footer />*/}
    </>
  );
}

export default App;
