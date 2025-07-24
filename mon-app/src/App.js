import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // importe le fichier CSS

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/todos");
      setTodos(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
    }
  };

  const addTodo = async () => {
    if (!task.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      text: task,
    };

    try {
      await axios.post("http://localhost:3000/todos", newTask);
      setTask("");
      fetchTodos();
    } catch (err) {
      console.error("Erreur lors de l'ajout :", err);
    }
  };

  return (
    <div className="container">
      <h1>Ma Todo List</h1>

      <div className="input-group">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Nouvelle tâche"
          className="task-input"
        />
        <button onClick={addTodo} className="btn-add">
          Ajouter
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
