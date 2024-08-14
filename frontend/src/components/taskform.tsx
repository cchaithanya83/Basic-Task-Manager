import React, { useState, useEffect } from "react";

interface TaskFormProps {
  task: any | null;
  onSave: (task: any) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave }) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDueDate(task.dueDate);
      setDescription(task.description);
    } else {
      setTitle("");
      setDueDate("");
      setDescription("");
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, dueDate, description });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{task ? "Edit Task" : "Create Task"}</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        placeholder="Due Date"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button type="submit">{task ? "Update" : "Create"} Task</button>
    </form>
  );
};

export default TaskForm;
