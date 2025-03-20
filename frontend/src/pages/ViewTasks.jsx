// pages/ViewTasks.js
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "../styles/viewTasks.css";
import Navbar from "../components/Navbar";

const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const today = new Date().toISOString().split("T")[0];
      const todayTasks = res.data.filter(
        (task) => new Date(task.deadline).toISOString().split("T")[0] === today
      );

      setTasks(todayTasks);
    } catch (error) {
      console.error("Error fetching tasks", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const taskCounts = { low: 0, medium: 0, high: 0 };
  tasks.forEach((task) => {
    if (!task.completed) {
      taskCounts[task.priority]++;
    }
  });
  const groupedTasks = tasks.reduce((acc, task) => {
    if (task.completed) {
      acc.completed = acc.completed || [];
      acc.completed.push(task);
    } else {
      if (!acc[task.priority]) {
        acc[task.priority] = [];
      }
      acc[task.priority].push(task);
    }
    return acc;
  }, {});
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceList = source.droppableId;
    const destinationList = destination.droppableId;
    const task = groupedTasks[sourceList][source.index];

    let updatedTask = { priority: destinationList };
    if (destinationList === "completed") {
      updatedTask = { completed: true };
    }

    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${task._id}`,
        updatedTask,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t._id === task._id ? { ...t, ...updatedTask } : t
        )
      );
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="view-tasks-container">
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks due today.</p>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <h1>Todays Tasks</h1>
            <div className="tasks-by-priority">
              {["low", "medium", "high"].map((priority) => (
                <Droppable key={priority} droppableId={priority}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="priority-group"
                    >
                      <h2>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}{" "}
                        Priority ({taskCounts[priority]} tasks)
                      </h2>
                      {groupedTasks[priority]?.length ? (
                        groupedTasks[priority].map((task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="task-item"
                              >
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <p>
                                  Deadline:{" "}
                                  {new Date(task.deadline).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <p>No {priority}-priority tasks.</p>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}

              {/* Completed Tasks Section */}
              <Droppable droppableId="completed">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="completed-group"
                  >
                    <h2>Completed Tasks</h2>
                    {groupedTasks.completed?.length ? (
                      groupedTasks.completed.map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="task-item completed"
                            >
                              <h3>{task.title}</h3>
                              <p>{task.description}</p>
                              <p>Completed</p>
                              <button
                                className="delete-btn"
                                onClick={() => deleteTask(task._id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <p>No completed tasks.</p>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        )}
      </div>
    </>
  );
};

export default ViewTasks;
