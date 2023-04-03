import { useState } from "react";
import http from './api'
import styles from "../styles/Home.module.css";

export default function Home(props) {
	const [todos, setTasks] = useState(props.todos);
	const [todo, setTask] = useState({ todo: "" });

	const handleChange = ({ currentTarget: input }) => {
		input.value === ""
			? setTask({ todo: "" })
			: setTask((prev) => ({ ...prev, todo: input.value }));
	};

	const addTask = async (e) => {
		e.preventDefault();
		try {
			if (todo._id) {
				const { data } = await http.put("/todo/" + todo._id, {
					todo: todo.todo,
				});
				const originalTasks = [...todos];
				const index = originalTasks.findIndex((t) => t._id === todo._id);
				originalTasks[index] = data.data;
				setTasks(originalTasks);
				setTask({ todo: "" });
			} else {
				const { data } = await http.post('/todo', todo);
				setTasks((prev) => [...prev, data.data]);
				setTask({ todo: "" });
			}
		} catch (error) {
			console.log(error);
		}
	};

	const editTask = (id) => {
		const currentTask = todos.filter((todo) => todo._id === id);
		setTask(currentTask[0]);
	};

	const updateTodo = async (id) => {
		try {
			const originalTasks = [...todos];
			const index = originalTasks.findIndex((t) => t._id === id);
			const { data } = await http.put("/todo/" + id, {
				isCompleted: !originalTasks[index].isCompleted,
			});
			originalTasks[index] = data.data;
			setTasks(originalTasks);
		} catch (error) {
			console.log(error);
		}
	};

	const deleteTask = async (id) => {
		try {
			const { data } = await http.delete('/todo/' + id);
			setTasks((prev) => prev.filter((todo) => todo._id !== id));
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<main className={styles.main}>
			<h1 className={styles.heading}>Todo-Application</h1>
			<div className={styles.container}>
				<form onSubmit={addTask} className={styles.form_container}>
					<input
						className={styles.input}
						type="text"
						placeholder="Task to be done..."
						onChange={handleChange}
						value={todo.todo}
					/>
					<button type="submit" className={styles.submit_btn}>
						{todo._id ? "Update" : "Add"}
					</button>
				</form>
				{todos.map((todo) => (
					<div className={styles.todo_container} key={todo._id}>
						<input
							type="checkbox"
							className={styles.check_box}
							checked={todo.isCompleted}
							onChange={() => updateTodo(todo._id)}
						/>
						<p
							className={
								todo.isCompleted
									? styles.todo_text + " " + styles.line_through
									: styles.todo_text
							}
						>
							{todo.todo}
						</p>
						<button
							onClick={() => editTask(todo._id)}
							className={styles.edit_todo}
						>
							&#9998;
						</button>
						<button
							onClick={() => deleteTask(todo._id)}
							className={styles.remove_todo}
						>
							&#10006;
						</button>
					</div>
				))}
				{todos.length === 0 && <h2 className={styles.no_todos}>No todos</h2>}
			</div>
		</main>
	);
}

export const getServerSideProps = async () => {
	const { data } = await http.get('/todos');
	return {
		props: {
			todos: data.data,
		},
	};
};
