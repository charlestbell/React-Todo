'use client';
import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await fetch('http://localhost:3001/api/todos');
    const data = await response.json();
    setTodos(data);
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const response = await fetch('http://localhost:3001/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTodo }),
    });
    const data = await response.json();
    setTodos([data, ...todos]);
    setNewTodo('');
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    await fetch(`http://localhost:3001/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: !completed }),
    });
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !completed } : todo
    ));
  };

  const deleteTodo = async (id: number) => {
    await fetch(`http://localhost:3001/api/todos/${id}`, {
      method: 'DELETE',
    });
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto todo-container p-6">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          Todo App
        </h1>
        
        <form onSubmit={addTodo} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-purple-500"
              placeholder="Add a new todo..."
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg hover:opacity-90 transition-opacity"
            >
              Add
            </button>
          </div>
        </form>

        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/50 border border-gray-700"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700"
              />
              <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-400"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
} 