import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  // Charger les tâches au démarrage
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
  try {
    const res = await axios.get("http://localhost:3000/todos");
    console.log("Todos reçus du backend:", res.data);
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
      setTask(""); // Vide le champ
      fetchTodos(); // Recharge la liste
    } catch (err) {
      console.error("Erreur lors de l'ajout :", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Ma Todo List</h1>

      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Nouvelle tâche"
        style={{ marginRight: 10 }}
      />
      <button onClick={addTodo}>Ajouter</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
