import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
	const [todos, setTodos] = useState([]);
	const [newTodo, setNewTodo] = useState("");

	useEffect(() => {
		fetchTodos();
	}, []);

	const fetchTodos = async () => {
		try {
			const response = await axios.get("http://localhost:5000/api/todos");
			setTodos(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleInputChange = (e) => {
		setNewTodo(e.target.value);
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		if (newTodo.trim() === "") return;

		try {
			const response = await axios.post("http://localhost:5000/api/todos", {
				title: newTodo,
				completed: false,
			});

			setTodos([...todos, response.data]);
			setNewTodo("");
		} catch (error) {
			console.error(error);
		}
	};

	const toggleTodo = async (id) => {
		try {
			const response = await axios.put(`http://localhost:5000/api/todos/${id}`, {
				completed: !todos.find((todo) => todo._id === id).completed,
			});

			setTodos(todos.map((todo) => (todo._id === id ? { ...todo, completed: response.data.completed } : todo)));
		} catch (error) {
			console.error(error);
		}
	};

	const deleteTodo = async (id) => {
		try {
			await axios.delete(`http://localhost:5000/api/todos/${id}`);
			setTodos(todos.filter((todo) => todo._id !== id));
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="App">
			<h1>Todo App ✅</h1>
			<div className="form-class">
				<form onSubmit={handleFormSubmit}>
					<input type="text" value={newTodo} onChange={handleInputChange} placeholder="New Todo" />
					<button type="submit">
						<span class="glyphicon glyphicon-send"></span>
					</button>
				</form>
			</div>
			<div className="todo-class">
				<ul>
					<h3>Your Todos: </h3>
					{todos.map((todo) => (
						<li key={todo._id}>
							<input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo._id)} />
							<button onClick={() => deleteTodo(todo._id)}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									class="bi bi-trash"
									viewBox="0 0 16 16"
								>
									<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
									<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
								</svg>
							</button>
							<span className={todo.completed ? "completed" : ""}>{todo.title}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default App;
