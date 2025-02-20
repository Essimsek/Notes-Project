import { useState } from "react";

const Note = (props) => {
  return (
      <div className="flex flex-col flex-wrap w-96 min-h-64 transform hover:scale-105 transition-all font-indieFlower font-medium">
        <div className="relative h-full">
          <span className={`absolute top-0 left-0 w-full h-full mt-1 ml-1 -z-10 ${props.color} rounded-lg`}></span>
          <div className={`relative h-full p-4 border-2 ${props.color} rounded-lg`}>
            <div className="flex items-center -mt-1">
              <h3 className="my-2 ml-3 text-xl font-bold text-gray-800 uppercase">{props.title}</h3>
            </div>
            <p className="mt-3 mb-1 text-gray-800 uppercase">{} {props.date}</p>
            <p className="mb-6 text-gray-900 text-md ">{props.content}</p>
          </div>
          <button onClick={() => props.onEdit(props.id)} className="absolute left-2 bottom-2 border-b-4 border-r-2 transition-all hover:scale-95 border-teal-700 bg-teal-600 hover:border-teal-500 rounded-full px-2">Edit</button>
          <button onClick={() => props.onDelete(props.id)} className="absolute right-2 bottom-2 border-b-4 border-l-2 transition-all hover:scale-95 hover:border-red-500 border-red-700 bg-red-600 rounded-full px-2">Delete</button>
        </div>
      </div>
  );
}

const EditNote = (props) => {
  const [title, setTitle] = useState(props.title);
  const [content, setContent] = useState(props.content);
  return (
      <div className="flex flex-col flex-wrap w-96 min-h-64 transform hover:scale-105 transition-all font-indieFlower font-medium">
        <div className="relative h-full">
          <span className={`absolute top-0 left-0 w-full h-full mt-1 ml-1 -z-10 ${props.color} rounded-lg`}></span>
          <div className={`relative h-full p-4 border-2 ${props.color} rounded-lg`}>
            <div className="flex items-center -mt-1">
              <input className="w-full p-3" type="text" name="title" placeholder="Title here..." autoFocus  value={title} onChange={(e) => setTitle(e.target.value)}/>
            </div>
            <p className="mt-3 mb-1 text-gray-800 uppercase">{} {props.date}</p>
            <textarea className="w-full rounded bg-teal-400 mb-4 p-6 h-28" name="content" placeholder="Your note is here..." value={content} onChange={(e) => setContent(e.target.value)}></textarea>
          </div>
          <button onClick={() => {props.onSave(props.id, title, content)}} className="absolute left-2 bottom-2 border-b-4 border-r-2 transition-all hover:scale-95 border-teal-700 bg-teal-600 hover:border-teal-500 rounded-full px-2">Save</button>
          <button onClick={() => {props.onCancel(props.id)}} className="absolute right-2 bottom-2 border-b-4 border-l-2 transition-all hover:scale-95 hover:border-red-500 border-red-700 bg-red-600 rounded-full px-2">Cancel</button>
        </div>
      </div>
  );
}

export default Note;
export { EditNote };
