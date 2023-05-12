const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

const todoSchema = new mongoose.Schema({
	title: String,
	completed: Boolean,
});

const Todo = mongoose.model("Todo", todoSchema);
console.log(process.env);
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
	console.log("Connected to MongoDB");
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

// Get all todos
app.get("/api/todos", (req, res) => {
	Todo.find({})
		.then((data) => {
			res.status(200).send(data);
		})
		.catch((err) => {
			res.status(500).send(err);
		});
});

// Create a new todo
app.post("/api/todos", (req, res) => {
	const todo = new Todo(req.body);
	todo.save()
		.then((data) => {
			res.status(201).send(data);
		})
		.catch((err) => {
			res.status(500).send(err);
		});
});

// Update a todo
app.put("/api/todos/:id", (req, res) => {
	Todo.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then((data) => {
			res.status(200).send(data);
		})
		.catch((err) => {
			res.status(500).send(err);
		});
});

// Delete a todo
app.delete("/api/todos/:id", (req, res) => {
	Todo.findByIdAndRemove(req.params.id)
		.then(() => {
			res.sendStatus(204);
		})
		.catch((err) => {
			res.status(500).send(err);
		});
});
