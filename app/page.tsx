"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  List,
  ListItem,
  Checkbox,
  IconButton,
  Typography,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await fetch("http://localhost:3001/api/todos");
    const data = await response.json();
    setTodos([...data]);
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const response = await fetch("http://localhost:3001/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTodo }),
    });
    const data = await response.json();
    setTodos([data, ...todos]);
    setNewTodo("");
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    await fetch(`http://localhost:3001/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !completed }),
    });
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      )
    );
  };

  const deleteTodo = async (id: number) => {
    await fetch(`http://localhost:3001/api/todos/${id}`, {
      method: "DELETE",
    });
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(45deg, #1a237e, #000051)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          width: "200%",
          height: "200%",
          background: `radial-gradient(circle, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0.05) 50%, transparent 100%)`,
          animation: "rotate 20s linear infinite",
        },
        "@keyframes rotate": {
          "0%": {
            transform: "translate(-50%, -50%) rotate(0deg)",
          },
          "100%": {
            transform: "translate(-50%, -50%) rotate(360deg)",
          },
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: "relative", py: 8 }}>
        <Paper
          elevation={24}
          sx={{
            p: 4,
            background: "rgba(18, 18, 38, 0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              mb: 4,
              textAlign: "center",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "3.5rem",
              letterSpacing: "-0.02em",
              background: "linear-gradient(45deg, #2196f3, #1976d2)",
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Todos
          </Typography>

          <Box component="form" onSubmit={addTodo} sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new todo..."
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.1)",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: "linear-gradient(45deg, #2196f3, #1976d2)",
                  px: 4,
                }}
              >
                Add
              </Button>
            </Box>
          </Box>

          <List sx={{ width: "100%" }}>
            {todos.length > 0 ? (
              todos.map((todo) => (
                <ListItem
                  key={todo.id}
                  sx={{
                    mb: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    borderRadius: 1,
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => deleteTodo(todo.id)}
                      sx={{ color: "#ef5350" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id, todo.completed)}
                    sx={{
                      color: "rgba(255, 255, 255, 0.3)",
                      "&.Mui-checked": {
                        color: "#2196f3",
                      },
                    }}
                  />
                  <Typography
                    sx={{
                      ml: 2,
                      textDecoration: todo.completed ? "line-through" : "none",
                      color: todo.completed ? "text.disabled" : "text.primary",
                    }}
                  >
                    {todo.title}
                  </Typography>
                </ListItem>
              ))
            ) : (
              <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
                Loading...
              </Typography>
            )}
          </List>
        </Paper>
      </Container>
    </Box>
  );
}
