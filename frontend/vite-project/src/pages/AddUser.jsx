import { useState } from "react";
import { createEmployeeApi } from "../api/authApi";
import {
  TextField,
  Button,
  Paper,
  MenuItem,
  Typography,
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AddUser() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: ""
  });

  const handleSubmit = async () => {
    try {
      setError("");

      if (!form.name || !form.email || !form.department) {
        setError("All fields are required");
        return;
      }

      await createEmployeeApi({
        name: form.name,
        email: form.email,
        department: Number(form.department)
      });

      navigate("/admin");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Failed to create user"
      );
    }
  };

  return (
    <>
      <Navbar />

      {/* GLOBAL CSS INSIDE THIS FILE */}
      <style>
        {`
          .add-user-bg {
            min-height: 90vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 40px 20px;
            background: linear-gradient(135deg, #c7d2fe, #e9d5ff, #dbeafe);
          }

          .add-user-card {
            width: 100%;
            max-width: 520px;
            padding: 40px;
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(8px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.6);
            transition: all 0.3s ease;
          }

          .add-user-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.12);
          }

          .add-user-title {
            font-weight: 600;
            margin-bottom: 24px;
            color: #1e293b;
          }

          .add-user-error {
            background-color: #fee2e2;
            color: #dc2626;
            padding: 8px 12px;
            border-radius: 8px;
            margin-bottom: 16px;
            font-size: 14px;
          }

          .add-user-button {
            margin-top: 20px;
            padding: 14px;
            font-weight: 600;
            text-transform: none;
            border-radius: 12px;
            background: linear-gradient(90deg, #6366f1, #8b5cf6);
            box-shadow: 0 10px 25px rgba(99,102,241,0.3);
            transition: all 0.3s ease;
          }

          .add-user-button:hover {
            background: linear-gradient(90deg, #4f46e5, #7c3aed);
            transform: translateY(-3px);
            box-shadow: 0 14px 30px rgba(99,102,241,0.4);
          }

          .MuiOutlinedInput-root {
            background-color: #f8fafc !important;
            border-radius: 12px !important;
          }
        `}
      </style>

      <div className="add-user-bg">
        <Paper elevation={0} className="add-user-card">
          <Typography variant="h5" className="add-user-title">
            Add New Employee
          </Typography>

          {error && (
            <div className="add-user-error">
              {error}
            </div>
          )}

          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <TextField
            label="Email Address"
            type="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <TextField
            select
            label="Department"
            fullWidth
            margin="normal"
            value={form.department}
            onChange={(e) =>
              setForm({ ...form, department: e.target.value })
            }
          >
            <MenuItem value={1}>All</MenuItem>
            <MenuItem value={2}>Sap</MenuItem>
            <MenuItem value={3}>Microsoft</MenuItem>
            <MenuItem value={4}>SalesForce</MenuItem>
          </TextField>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            className="add-user-button"
          >
            Create Employee
          </Button>
        </Paper>
      </div>
    </>
  );
}