import { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";

const TaskCalendar = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasksOnDate, setTasksOnDate] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTasks(res.data);
        updateTasksOnDate(res.data, selectedDate);
      } catch (error) {
        console.error("Error fetching tasks", error);
      }
    };

    fetchTasks();
  }, [token, navigate, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const updateTasksOnDate = (taskList, date) => {
    const selected = new Date(date).setHours(0, 0, 0, 0);

    const tasksDueOnDate = taskList.filter((task) => {
      const taskDeadline = new Date(task.deadline).setHours(0, 0, 0, 0);
      return taskDeadline === selected && !task.completed;
    });

    setTasksOnDate(tasksDueOnDate);
  };

  const tileClassName = ({ date }) => {
    const currentDate = new Date(date).setHours(0, 0, 0, 0);

    const hasIncompleteTasks = tasks.some(
      (task) =>
        new Date(task.deadline).setHours(0, 0, 0, 0) === currentDate &&
        !task.completed
    );

    return hasIncompleteTasks ? "highlight" : null;
  };

  return (
    <div className="calendar-container">
      <h2>Task Calendar</h2>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileClassName={tileClassName}
      />
      <div className="tasks-on-date">
        <h3>Tasks due on {selectedDate.toDateString()}</h3>
        {tasksOnDate.length > 0 ? (
          <ul>
            {tasksOnDate.map((task) => (
              <li key={task._id}>
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <p>Priority: {task.priority}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks due on this date.</p>
        )}
      </div>
    </div>
  );
};

export default TaskCalendar;
