import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface User {
  name: string;
  email: string;
  avatar: string;
}

function App() {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState("light");
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Learn React", completed: true },
    { id: 2, text: "Master Tailwind CSS", completed: true },
    { id: 3, text: "Explore DaisyUI", completed: false },
    { id: 4, text: "Build awesome apps", completed: false },
  ]);
  const [newTask, setNewTask] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user] = useState<User>({
    name: "John Doe",
    email: "john@evera.dev",
    avatar:
      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
  });
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Welcome to Evera Frontend!", type: "success" },
    { id: 2, message: "Docker setup completed", type: "info" },
  ]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => {
                    /* Mobile menu toggle logic */
                  }}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>

              {/* Logo */}
              <div className="flex-shrink-0 flex items-center ml-4 md:ml-0">
                <h1 className="text-xl font-bold">🚀 Evera Frontend</h1>
              </div>

              {/* Desktop navigation */}
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "dashboard"
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("tasks")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "tasks"
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => setActiveTab("components")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "components"
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  Components
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Selector */}
              <div className="relative">
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="bg-blue-700 text-white border border-blue-500 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  {themes.map((t) => (
                    <option key={t} value={t} className="bg-blue-700">
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* User Avatar */}
              <div className="relative">
                <img
                  className="h-8 w-8 rounded-full border-2 border-blue-300"
                  src={user.avatar}
                  alt="User avatar"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-center p-4 rounded-lg shadow-lg max-w-sm ${
                notif.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : notif.type === "info"
                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                  : notif.type === "warning"
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              <svg
                className="w-5 h-5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="flex-1">{notif.message}</span>
              <button
                onClick={() => dismissNotification(notif.id)}
                className="ml-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Hero Section */}
            <div className="hero bg-gradient-to-r from-primary to-secondary text-primary-content rounded-lg mb-8">
              <div className="hero-content text-center py-12">
                <div className="max-w-md">
                  <div className="flex justify-center gap-4 mb-6">
                    <a
                      href="https://vite.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={viteLogo} className="logo" alt="Vite logo" />
                    </a>
                    <a
                      href="https://react.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                      />
                    </a>
                  </div>
                  <h1 className="text-5xl font-bold mb-4">Evera Frontend</h1>
                  <p className="text-lg mb-6">
                    Built with Vite, React, Tailwind CSS, and DaisyUI
                  </p>
                  <div className="flex gap-2 justify-center">
                    <div className="badge badge-outline">React 19</div>
                    <div className="badge badge-outline">Tailwind CSS</div>
                    <div className="badge badge-outline">DaisyUI</div>
                    <div className="badge badge-outline">Docker</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="stats shadow w-full mb-8">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">Button Clicks</div>
                <div className="stat-value text-primary">{count}</div>
                <div className="stat-desc">Keep clicking!</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">Tasks</div>
                <div className="stat-value text-secondary">
                  {tasks.filter((t) => t.completed).length}/{tasks.length}
                </div>
                <div className="stat-desc">Completed</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-accent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">Theme</div>
                <div className="stat-value text-accent">{theme}</div>
                <div className="stat-desc">Current theme</div>
              </div>
            </div>

            {/* Interactive Counter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body text-center">
                <h2 className="card-title justify-center">
                  Interactive Counter
                </h2>
                <div className="text-6xl font-bold text-primary my-4">
                  {count}
                </div>
                <div className="card-actions justify-center gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => setCount(count + 1)}
                  >
                    +1
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setCount(count + 5)}
                  >
                    +5
                  </button>
                  <button
                    className="btn btn-accent"
                    onClick={() => setCount(count + 10)}
                  >
                    +10
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => setCount(0)}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Task Manager</h2>

              {/* Add Task */}
              <div className="form-control">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Add a new task..."
                    className="input input-bordered flex-1"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTask()}
                  />
                  <button className="btn btn-primary" onClick={addTask}>
                    Add
                  </button>
                </div>
              </div>

              {/* Task List */}
              <div className="divider"></div>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 bg-base-200 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                    />
                    <span
                      className={`flex-1 ${
                        task.completed ? "line-through opacity-50" : ""
                      }`}
                    >
                      {task.text}
                    </span>
                    <button
                      className="btn btn-sm btn-error btn-outline"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              {tasks.length === 0 && (
                <div className="text-center py-8 opacity-50">
                  <p>No tasks yet. Add one above!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Components Tab */}
        {activeTab === "components" && (
          <div className="space-y-8">
            {/* Buttons Showcase */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Buttons</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="btn btn-primary">Primary</button>
                  <button className="btn btn-secondary">Secondary</button>
                  <button className="btn btn-accent">Accent</button>
                  <button className="btn btn-neutral">Neutral</button>
                  <button className="btn btn-info">Info</button>
                  <button className="btn btn-success">Success</button>
                  <button className="btn btn-warning">Warning</button>
                  <button className="btn btn-error">Error</button>
                </div>
                <div className="divider">Sizes</div>
                <div className="flex flex-wrap gap-2 items-center">
                  <button className="btn btn-xs">Tiny</button>
                  <button className="btn btn-sm">Small</button>
                  <button className="btn">Normal</button>
                  <button className="btn btn-lg">Large</button>
                </div>
              </div>
            </div>

            {/* Form Elements */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Form Elements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="password"
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Select</span>
                    </label>
                    <select className="select select-bordered">
                      <option disabled selected>
                        Choose option
                      </option>
                      <option>Option 1</option>
                      <option>Option 2</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Range</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      className="range range-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Alerts</h2>
                <div className="space-y-4">
                  <div className="alert alert-info">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="stroke-current shrink-0 w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>New software update available.</span>
                  </div>
                  <div className="alert alert-success">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Your purchase has been confirmed!</span>
                  </div>
                  <div className="alert alert-warning">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <span>Warning: Invalid email address!</span>
                  </div>
                  <div className="alert alert-error">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Error! Task failed successfully.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded mt-16">
        <nav className="grid grid-flow-col gap-4">
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav>
          <div className="grid grid-flow-col gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
          </div>
        </nav>
        <aside>
          <p>Copyright © 2024 - All right reserved by Evera Frontend</p>
        </aside>
      </footer>
    </div>
  );
}

export default App;
