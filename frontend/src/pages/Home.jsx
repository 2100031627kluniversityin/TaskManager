import "../styles/home.css";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div>
      {/* Navbar */}
      <header className="header">
        <h1 className="logo">TaskMaster</h1>
        <nav className="navbar">
          <ul>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#quotes">Motivation</a>
            </li>
            <li>
              <a href="#cta">Get Started</a>
            </li>
            <li>
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Achieve More, Stress Less</h1>
          <p>Master your tasks, boost productivity, and stay ahead.</p>
          <button className="cta-btn">
            <Link to="/login" className="nav-link">
              Start now
            </Link>
          </button>
        </div>
      </section>

      {/* Features Section with Large Cards */}
      <section id="features" className="features">
        <h2>Supercharged Task Management</h2>
        <div className="feature-container">
          <div className="feature-card">
            <h3>ask Overview</h3>
            <p>View all tasks in one place, sorted by priority and status.</p>
          </div>
          <div className="feature-card">
            <h3>Manage Tasks Easily</h3>
            <p>
              Create, update, and delete tasks effortlessly with titles,
              deadlines, and priorities.
            </p>
          </div>
          <div className="feature-card">
            <h3>Task Management</h3>
            <p>Drag and drop tasks to reorder or mark them as complete.</p>
          </div>
          <div className="feature-card">
            <h3>Task Filtering</h3>
            <p>Filter tasks by priority to focus on what’s important.</p>
          </div>
          <div className="feature-card">
            <h3>Secure Access</h3>
            <p>Log in securely to access a personalized task list.</p>
          </div>
        </div>
      </section>

      {/* Motivational Quotes Section */}
      <section id="quotes" className="quotes">
        <h2>Stay Inspired</h2>
        <div className="quote-box">
          <p>
            It does not matter how slowly you go, as long as you do not stop
          </p>
        </div>
        <div className="quote-box">
          <p>
            You can do two things at once, but you cant focus effectively on two
            things at once
          </p>
        </div>
        <div className="quote-box">
          <p>The two most powerful warriors are patience and time</p>
        </div>
      </section>

      <section id="cta" className="cta-section">
        <h2>Take Control of Your Time</h2>
        <Link to="/register">
          <button className="cta-btn">Get Started Now</button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© Hello</p>
      </footer>
    </div>
  );
};

export default Home;
