import { useState } from "react";
import { createEventApi } from "../api/eventApi";
import { departments } from "../utils/departmentMap";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TitleOutlinedIcon from "@mui/icons-material/TitleOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined";
import CorporateFareOutlinedIcon from "@mui/icons-material/CorporateFareOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "rgba(255,255,255,0.04)",
    color: "#e2e8f0",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s ease",
    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
    "&:hover fieldset": { borderColor: "rgba(99,179,237,0.4)" },
    "&.Mui-focused fieldset": {
      borderColor: "#63b3ed",
      boxShadow: "0 0 0 3px rgba(99,179,237,0.1)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.35)",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.9rem",
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#63b3ed" },
  "& .MuiInputAdornment-root .MuiSvgIcon-root": {
    color: "rgba(255,255,255,0.25)",
    fontSize: "1.1rem",
  },
  "& .MuiSelect-icon": { color: "rgba(255,255,255,0.3)" },
  "& input[type='datetime-local']::-webkit-calendar-picker-indicator": {
    filter: "invert(0.5)",
    cursor: "pointer",
  },
};

const menuSx = {
  PaperProps: {
    sx: {
      backgroundColor: "#1e2a3a",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "10px",
      boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
      "& .MuiMenuItem-root": {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.88rem",
        color: "rgba(255,255,255,0.65)",
        py: 1.1,
        "&:hover": {
          backgroundColor: "rgba(99,179,237,0.1)",
          color: "#63b3ed",
        },
        "&.Mui-selected": {
          backgroundColor: "rgba(99,179,237,0.12)",
          color: "#63b3ed",
          fontWeight: 600,
          "&:hover": { backgroundColor: "rgba(99,179,237,0.16)" },
        },
      },
    },
  },
};

const FieldLabel = ({ children }) => (
  <Typography sx={{
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.72rem", fontWeight: 700,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: "0.1em", textTransform: "uppercase", mb: 0.75,
  }}>
    {children}
  </Typography>
);

export default function CreateEvent() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    eventDateTime: "",
    maxSeats: "",
    allowedDepartment: "",
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async () => {
    setError("");
    if (!form.title || !form.description || !form.location || !form.eventDateTime || !form.maxSeats || !form.allowedDepartment) {
      setError("All fields are required.");
      return;
    }
    if (Number(form.maxSeats) < 3) {
      setError("Max seats must be at least 3.");
      return;
    }
    try {
      setLoading(true);
      await createEventApi({
        title: form.title,
        description: form.description,
        location: form.location,
        eventDateTime: new Date(form.eventDateTime).toISOString(),
        maxSeats: Number(form.maxSeats),
        allowedDepartment: Number(form.allowedDepartment),
      });
      setSuccess(true);
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data || "Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  const filledCount = Object.values(form).filter(Boolean).length;
  const progressPercent = Math.round((filledCount / 6) * 100);

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)" }}>
      <Navbar />

      {/* Decorative blobs */}
      <Box sx={{
        position: "fixed", top: 80, right: -80,
        width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,179,237,0.06) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <Box sx={{
        position: "fixed", bottom: 0, left: -60,
        width: 260, height: 260, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(183,148,244,0.05) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <Box sx={{
        position: "relative", zIndex: 1,
        maxWidth: 720, mx: "auto",
        px: { xs: 2, md: 4 }, py: 5,
      }}>

        {/* Back + Page Header */}
        <Box sx={{ mb: 4 }}>
          <Box
            onClick={() => navigate("/admin")}
            sx={{
              display: "inline-flex", alignItems: "center", gap: 0.75,
              color: "rgba(255,255,255,0.35)", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem",
              mb: 2.5, transition: "color 0.15s ease",
              "&:hover": { color: "rgba(255,255,255,0.65)" },
            }}
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: 15 }} />
            Back to Dashboard
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                <Box sx={{
                  width: 36, height: 36, borderRadius: "9px",
                  background: "rgba(99,179,237,0.1)",
                  border: "1px solid rgba(99,179,237,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <EventNoteOutlinedIcon sx={{ color: "#63b3ed", fontSize: 18 }} />
                </Box>
                <Typography sx={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.8rem", fontWeight: 700, color: "#ffffff",
                }}>
                  Create Event
                </Typography>
              </Box>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.83rem", color: "rgba(255,255,255,0.35)", ml: 0.5,
              }}>
                Fill in the details below to publish a new event
              </Typography>
            </Box>

            {/* Completion Badge */}
            <Box sx={{
              display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5,
            }}>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.7rem", color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.06em", textTransform: "uppercase",
              }}>
                Form Completion
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 100, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.08)" }}>
                  <Box sx={{
                    height: "100%", borderRadius: 2,
                    width: `${progressPercent}%`,
                    background: progressPercent === 100
                      ? "linear-gradient(90deg, #68d391, #38a169)"
                      : "linear-gradient(90deg, #63b3ed, #4299e1)",
                    transition: "width 0.3s ease",
                  }} />
                </Box>
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.75rem", fontWeight: 700,
                  color: progressPercent === 100 ? "#68d391" : "#63b3ed",
                }}>
                  {progressPercent}%
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Error */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{
              mb: 3, borderRadius: "10px",
              backgroundColor: "rgba(252,129,129,0.1)",
              border: "1px solid rgba(252,129,129,0.2)",
              color: "#fc8181",
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem",
              "& .MuiAlert-icon": { color: "#fc8181" },
            }}
          >
            {error}
          </Alert>
        )}

        {/* Success */}
        {success && (
          <Box sx={{
            display: "flex", alignItems: "center", gap: 1.5,
            backgroundColor: "rgba(104,211,145,0.1)",
            border: "1px solid rgba(104,211,145,0.25)",
            borderRadius: "10px", px: 2.5, py: 1.75, mb: 3,
          }}>
            <CheckCircleOutlineIcon sx={{ color: "#68d391", fontSize: 20 }} />
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.88rem", fontWeight: 600, color: "#68d391",
            }}>
              Event created successfully! Redirecting to dashboard...
            </Typography>
          </Box>
        )}

        {/* Form Card */}
        <Box sx={{
          backgroundColor: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "18px",
          backdropFilter: "blur(20px)",
          overflow: "hidden",
        }}>

          {/* Section: Basic Info */}
          <Box sx={{ px: { xs: 3, md: 4 }, pt: 4, pb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <Box sx={{ width: 3, height: 18, borderRadius: 2, backgroundColor: "#63b3ed" }} />
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.75rem", fontWeight: 700,
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                Basic Information
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {/* Title */}
              <Box>
                <FieldLabel>Event Title</FieldLabel>
                <TextField
                  fullWidth
                  placeholder="e.g. Annual Tech Summit 2025"
                  value={form.title}
                  onChange={update("title")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </Box>

              {/* Description */}
              <Box>
                <FieldLabel>Description</FieldLabel>
                <TextField
                  fullWidth
                  placeholder="Describe what this event is about..."
                  multiline
                  rows={3}
                  value={form.description}
                  onChange={update("description")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.5 }}>
                        <DescriptionOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    ...inputSx,
                    "& .MuiOutlinedInput-root": {
                      ...inputSx["& .MuiOutlinedInput-root"],
                      alignItems: "flex-start",
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Divider */}
          <Box sx={{ height: 1, backgroundColor: "rgba(255,255,255,0.06)", mx: 4 }} />

          {/* Section: Logistics */}
          <Box sx={{ px: { xs: 3, md: 4 }, pt: 3.5, pb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <Box sx={{ width: 3, height: 18, borderRadius: 2, backgroundColor: "#b794f4" }} />
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.75rem", fontWeight: 700,
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                Event Logistics
              </Typography>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
              {/* Location */}
              <Box>
                <FieldLabel>Location</FieldLabel>
                <TextField
                  fullWidth
                  placeholder="e.g. Main Auditorium, Floor 3"
                  value={form.location}
                  onChange={update("location")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </Box>

              {/* Date & Time */}
              <Box>
                <FieldLabel>Date & Time</FieldLabel>
                <TextField
                  fullWidth
                  type="datetime-local"
                  value={form.eventDateTime}
                  onChange={update("eventDateTime")}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarMonthOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </Box>

              {/* Max Seats */}
              <Box>
                <FieldLabel>Max Seats</FieldLabel>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="Minimum 3"
                  inputProps={{ min: 3 }}
                  value={form.maxSeats}
                  onChange={update("maxSeats")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ChairOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </Box>

              {/* Department */}
              <Box>
                <FieldLabel>Allowed Department</FieldLabel>
                <TextField
                  select
                  fullWidth
                  value={form.allowedDepartment}
                  onChange={update("allowedDepartment")}
                  SelectProps={{ MenuProps: menuSx }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CorporateFareOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>
          </Box>

          {/* Divider */}
          <Box sx={{ height: 1, backgroundColor: "rgba(255,255,255,0.06)" }} />

          {/* Submit Footer */}
          <Box sx={{
            px: { xs: 3, md: 4 }, py: 3,
            display: "flex", alignItems: "center",
            justifyContent: "flex-end", gap: 2,
            flexWrap: "wrap",
            backgroundColor: "rgba(255,255,255,0.015)",
          }}>
            <Button
              variant="text"
              onClick={() => navigate("/admin")}
              sx={{
                color: "rgba(255,255,255,0.35)",
                textTransform: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500, fontSize: "0.88rem",
                borderRadius: "9px", px: 2.5,
                "&:hover": { color: "rgba(255,255,255,0.6)", backgroundColor: "rgba(255,255,255,0.04)" },
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || success}
              startIcon={
                loading
                  ? <CircularProgress size={15} sx={{ color: "rgba(255,255,255,0.6)" }} />
                  : success
                  ? <CheckCircleOutlineIcon sx={{ fontSize: "17px !important" }} />
                  : <AddCircleOutlineIcon sx={{ fontSize: "17px !important" }} />
              }
              sx={{
                background: success
                  ? "rgba(104,211,145,0.15)"
                  : "linear-gradient(135deg, #4299e1, #3182ce)",
                borderRadius: "10px",
                textTransform: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600, fontSize: "0.9rem",
                px: 3, py: 1.15,
                boxShadow: "0 4px 18px rgba(66,153,225,0.3)",
                transition: "all 0.2s ease",
                minWidth: 150,
                "&:hover": {
                  background: "linear-gradient(135deg, #63b3ed, #4299e1)",
                  boxShadow: "0 6px 24px rgba(66,153,225,0.45)",
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  color: success ? "#68d391" : "rgba(255,255,255,0.2)",
                  background: success ? "rgba(104,211,145,0.12)" : "rgba(255,255,255,0.05)",
                  boxShadow: "none",
                  transform: "none",
                },
              }}
            >
              {loading ? "Creating..." : success ? "Created!" : "Create Event"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}