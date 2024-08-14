import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "./taskform";

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const uid = sessionStorage.getItem("uid");
      const response = await axios.get(
        `http://localhost:5000/api/tasks/${uid}`,
        {
          headers: { Authorization: `Bearer ${uid}` },
        }
      );
      setTasks(response.data);
    } catch (error) {
      setError("Failed to fetch tasks.");
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCreateOrUpdateTask = async (task: any) => {
    try {
      const uid = sessionStorage.getItem("uid");
      if (selectedTask) {
        // Update task
        await axios.post(
          `http://localhost:5000/api/tasks/${selectedTask.id}`,
          task,
          {
            headers: { Authorization: `Bearer ${uid}` },
          }
        );
        setSuccess("Task updated successfully.");
      } else {
        // Create task
        await axios.post("http://localhost:5000/api/tasks", task, {
          headers: { Authorization: `Bearer ${uid}` },
        });
        setSuccess("Task created successfully.");
      }
      setSelectedTask(null);
      fetchTasks();
    } catch (error) {
      setError("Failed to save task.");
      console.error("Error saving task:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const uid = sessionStorage.getItem("uid");
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${uid}` },
      });
      setSuccess("Task deleted successfully.");
      fetchTasks();
    } catch (error) {
      setError("Failed to delete task.");
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div>
      <h1>Task Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <TaskForm task={selectedTask} onSave={handleCreateOrUpdateTask} />
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> (Due: {task.dueDate})
            <button onClick={() => setSelectedTask(task)}>Edit</button>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
