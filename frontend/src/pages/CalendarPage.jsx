import TaskCalendar from "./TaskCalendar";
import Navbar from "../components/Navbar";
import "../styles/CalendarPage.css";

const CalendarPage = () => {
  return (
    <>
      <Navbar />
      <div className="calendar-page-container">
        <h1>Task Calendar</h1>
        <TaskCalendar />
      </div>
    </>
  );
};

export default CalendarPage;
