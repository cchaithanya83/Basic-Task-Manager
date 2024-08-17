import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "./taskform";
const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const uid = sessionStorage.getItem("uid");
      const response = await axios.get(
        `https://basic-task-manager.onrender.com/api/tasks/${uid}`,
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
          `https://basic-task-manager.onrender.com/api/tasks/${selectedTask.id}`,
          task,
          {
            headers: { Authorization: `Bearer ${uid}` },
          }
        );
        setSuccess("Task updated successfully.");
      } else {
        // Create task
        await axios.post(
          "https://basic-task-manager.onrender.com/api/tasks",
          task,
          {
            headers: { Authorization: `Bearer ${uid}` },
          }
        );
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
      await axios.delete(
        `https://basic-task-manager.onrender.com/api/tasks/${id}`,
        {
          headers: { Authorization: `Bearer ${uid}` },
        }
      );
      setSuccess("Task deleted successfully.");
      fetchTasks();
    } catch (error) {
      setError("Failed to delete task.");
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 ">
      <nav className="flex justify-between items-center min-w-full bg-white p-4 shadow-md">
        <div className="text-xl font-bold">TaskMate</div>
        <button
          onClick={() => {
            sessionStorage.removeItem("uid");
            window.location.href = "/";
          }}
          className="text-red-600 font-semibold"
        >
          Logout
        </button>
      </nav>
      <div className="max-w-4xl mx-auto mt-8">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <TaskForm
          task={selectedTask}
          onSave={handleCreateOrUpdateTask}
          onCancel={() => setSelectedTask(null)}
        />
        <div className="mt-8">
          {tasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p className="text-gray-600">Due: {task.dueDate}</p>
                  <p className="text-gray-800 mt-2">{task.description}</p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tasks available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
