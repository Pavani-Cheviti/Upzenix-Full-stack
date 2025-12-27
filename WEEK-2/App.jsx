import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('todo-tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch {
      return [];
    }
  });
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [filter, setFilter] = useState('all');
  const [newEndDate, setNewEndDate] = useState('');
  const [newPriority, setNewPriority] = useState('low');
  const [searchTerm, setSearchTerm] = useState('');

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() !== '') {
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        endDate: newEndDate,
        priority: newPriority,
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setNewEndDate('');
      setNewPriority('low');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = () => {
    if (editingText.trim() !== '') {
      setTasks(tasks.map(task =>
        task.id === editingId ? { ...task, text: editingText.trim() } : task
      ));
    }
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const markAllComplete = () => {
    setTasks(tasks.map(task => ({ ...task, completed: true })));
  };

  const markAllIncomplete = () => {
    setTasks(tasks.map(task => ({ ...task, completed: false })));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = () => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    };
    const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter() && matchesSearch;
  });

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>To-Do List</h1>

        <div className="add-task">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <input
            type="date"
            value={newEndDate}
            onChange={(e) => setNewEndDate(e.target.value)}
          />
          <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button onClick={addTask}>➕ Add Task</button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bulk-actions">
          <button onClick={markAllComplete}>✅ Mark All Complete</button>
          <button onClick={markAllIncomplete}>⭕ Mark All Incomplete</button>
          <button onClick={clearCompleted}>🗑️ Clear Completed</button>
        </div>

        <div className="filters">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All ({tasks.length})
          </button>
          <button
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active ({tasks.filter(t => !t.completed).length})
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed ({tasks.filter(t => t.completed).length})
          </button>
        </div>

        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="no-tasks">
              <p>No tasks found</p>
              <small>
                {filter === 'all' && tasks.length === 0
                  ? 'Add your first task above!'
                  : `No ${filter} tasks`}
              </small>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className={`task ${task.completed ? 'completed' : ''} priority-${task.priority}`}>
                <div className="task-content">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                  />

                  {editingId === task.id ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyPress={handleEditKeyPress}
                      onBlur={saveEdit}
                      autoFocus
                    />
                  ) : (
                    <span
                      className="task-text"
                      onDoubleClick={() => startEditing(task.id, task.text)}
                    >
                      {task.text}
                    </span>
                  )}
                </div>

                <div className="task-details">
                  <span className="priority">Priority: {task.priority}</span>
                  {task.endDate && <span className="end-date">Due: {new Date(task.endDate).toLocaleDateString()}</span>}
                </div>

                <div className="task-actions">
                  {editingId === task.id ? (
                    <>
                      <button onClick={saveEdit}>💾 Save</button>
                      <button onClick={cancelEdit}>❌ Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditing(task.id, task.text)}>✏️ Edit</button>
                      <button onClick={() => deleteTask(task.id)}>🗑️ Delete</button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;