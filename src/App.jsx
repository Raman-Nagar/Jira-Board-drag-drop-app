import { useState } from "react";
import "./App.css";

function generateUniqueId() {
  const timestamp = Date.now().toString(); // Current timestamp as string
  const randomData = Math.random().toString(36).substring(2);
  return timestamp + randomData;
}
export default function App() {
  const [newTicket, setNewTicket] = useState("");
  const [todos, setTodos] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [done, setDone] = useState([]);

  const addTicket = () => {
    if (newTicket.trim() !== "") {
      setTodos([{ id: generateUniqueId(), title: newTicket }, ...todos]);
      setNewTicket("");
    }
  };

  const handleDragStart = (e, task, sourceColumn) => {
    e.dataTransfer.setData("task", JSON.stringify(task));
    e.dataTransfer.setData("sourceColumn", sourceColumn);
  };

  const handleDrop = (e, targetColumn) => {
    const task = JSON.parse(e.dataTransfer.getData("task"));
    const sourceColumn = e.dataTransfer.getData("sourceColumn");
    if (targetColumn !== sourceColumn) {
      switch (targetColumn) {
        case "Todo":
          setTodos([...todos, task]);
          break;
        case "InProgress":
          setInProgress([...inProgress, task]);
          break;
        case "Done":
          setDone([...done, task]);
          break;
        default:
          break;
      }
      switch (sourceColumn) {
        case "Todo":
          setTodos(todos.filter((t) => t.id !== task.id));
          break;
        case "InProgress":
          setInProgress(inProgress.filter((t) => t.id !== task.id));
          break;
        case "Done":
          setDone(done.filter((t) => t.id !== task.id));
          break;
        default:
          break;
      }
    }
  };
  return (
    <div className="h-100 w-full flex items-center justify-center bg-teal-lightest font-sans">
      <div className="bg-white rounded shadow p-6 m-4 w-[80vw]">
        <div className="mb-4">
          <h1 className="text-grey-darkest text-xl font-semibold">
            Jira Board{" "}
          </h1>
          <div className="flex mt-4">
            <input
              className="shadow appearance-none border rounded w-1/2 py-2 px-3 mr-4 text-grey-darker"
              placeholder="Add Ticket"
              value={newTicket}
              onChange={(e) => setNewTicket(e.target.value)}
            />
            <button
              className="flex-no-shrink p-2 rounded text-white hover:bg-blue-700 bg-blue-400 text-lg font-medium"
              onClick={addTicket}
            >
              Add ticket
            </button>
          </div>
        </div>
        <div>
          <div className="flex mb-4 items-center justify-center gap-6">
            <Column
              title="Todo"
              tasks={todos}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
            />
            <Column
              title="InProgress"
              tasks={inProgress}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
            />
            <Column
              title="Done"
              tasks={done}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const Column = ({ title, tasks, onDrop, onDragStart }) => {
  return (
    <div
      className="flex flex-col gap-3 mb-4 bg-slate-100 rounded shadow h-[50vh] w-1/3 p-3"
      onDrop={(e) => onDrop(e, title)}
      onDragOver={(e) => e.preventDefault()}
    >
      <h1 className="text-lg font-semibold">{title}</h1>
      {tasks.map((task) => {
        return (
          <div
            className="bg-white p-2 rounded shadow decoration-lime-100"
            key={task.id}
            draggable
            onDragStart={(e) => onDragStart(e, task, title)}
          >
            <h2 className="text-lg">{task.title}</h2>
            <p className="text-slate-500">{task.id.slice(5, 15)}</p>
          </div>
        );
      })}
    </div>
  );
};
