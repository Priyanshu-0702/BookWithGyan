import { useState } from "react";
import { changePasswordApi } from "../api/authApi";
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "Too short", color: "#fc8181" },
    { label: "Weak", color: "#fc8181" },
    { label: "Fair", color: "#f6ad55" },
    { label: "Good", color: "#63b3ed" },
    { label: "Strong", color: "#68d391" },
  ];
  return { score, ...levels[score] };
};

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
      boxShadow: "0 0 0 3px rgba(99,179,237,0.12)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.4)",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.9rem",
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#63b3ed" },
  "& .MuiInputAdornment-root .MuiSvgIcon-root": {
    color: "rgba(255,255,255,0.3)",
    fontSize: "1.1rem",
  },
};

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const strength = getPasswordStrength(form.newPassword);

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword) {
      setError("Please fill in both fields.");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await changePasswordApi(form);
      setSuccess(true);
      setTimeout(() => navigate("/"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)",
        position: "relative",
        overflow: "hidden",
        px: 2,
      }}
    >
      {/* Decorative blobs */}
      <Box sx={{
        position: "absolute", top: "-100px", right: "-100px",
        width: 380, height: 380, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,179,237,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <Box sx={{
        position: "absolute", bottom: "-80px", left: "-80px",
        width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(183,148,244,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <Box sx={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>

        {/* Brand */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mb: 5 }}>
          <Box sx={{
            width: 38, height: 38, borderRadius: "10px",
            background: "linear-gradient(135deg, #63b3ed, #4299e1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(99,179,237,0.4)",
          }}>
            <EventIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Typography sx={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700, fontSize: "1.3rem",
            background: "linear-gradient(90deg, #ffffff 0%, #63b3ed 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            BookWithGyan
          </Typography>
        </Box>

        {/* Card */}
        <Box sx={{
          backgroundColor: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          backdropFilter: "blur(20px)",
          p: { xs: 3.5, sm: 4.5 },
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
        }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: "10px",
              background: "rgba(99,179,237,0.1)",
              border: "1px solid rgba(99,179,237,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <LockResetOutlinedIcon sx={{ color: "#63b3ed", fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.5rem", fontWeight: 700, color: "#ffffff",
                lineHeight: 1.2,
              }}>
                Change Password
              </Typography>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", mt: 0.3,
              }}>
                Keep your account secure
              </Typography>
            </Box>
          </Box>

          {/* Security hint */}
          <Box sx={{
            display: "flex", alignItems: "flex-start", gap: 1,
            backgroundColor: "rgba(99,179,237,0.06)",
            border: "1px solid rgba(99,179,237,0.15)",
            borderRadius: "10px", px: 1.75, py: 1.25, mt: 2.5, mb: 3,
          }}>
            <ShieldOutlinedIcon sx={{ fontSize: 15, color: "#63b3ed", mt: 0.15, flexShrink: 0 }} />
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6,
            }}>
              Use at least 8 characters with uppercase letters, numbers, and symbols for a strong password.
            </Typography>
          </Box>

          {/* Error */}
          {error && (
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{
                mb: 2.5, borderRadius: "10px",
                backgroundColor: "rgba(252,129,129,0.1)",
                border: "1px solid rgba(252,129,129,0.2)",
                color: "#fc8181",
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem",
                "& .MuiAlert-icon": { color: "#fc8181" },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Success */}
          {success && (
            <Box sx={{
              display: "flex", alignItems: "center", gap: 1.25,
              backgroundColor: "rgba(104,211,145,0.1)",
              border: "1px solid rgba(104,211,145,0.25)",
              borderRadius: "10px", px: 2, py: 1.5, mb: 2.5,
            }}>
              <CheckCircleOutlineIcon sx={{ color: "#68d391", fontSize: 18 }} />
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.85rem", fontWeight: 600, color: "#68d391",
              }}>
                Password updated! Redirecting...
              </Typography>
            </Box>
          )}

          {/* Current Password */}
          <Box sx={{ mb: 2.5 }}>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.75rem", fontWeight: 700,
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.08em", textTransform: "uppercase", mb: 1,
            }}>
              Current Password
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter current password"
              type={showCurrent ? "text" : "password"}
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrent(!showCurrent)}
                      edge="end"
                      sx={{ color: "rgba(255,255,255,0.3)", "&:hover": { color: "#63b3ed" } }}
                    >
                      {showCurrent
                        ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                        : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />
          </Box>

          {/* New Password */}
          <Box sx={{ mb: 1 }}>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.75rem", fontWeight: 700,
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.08em", textTransform: "uppercase", mb: 1,
            }}>
              New Password
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter new password"
              type={showNew ? "text" : "password"}
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockResetOutlinedIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNew(!showNew)}
                      edge="end"
                      sx={{ color: "rgba(255,255,255,0.3)", "&:hover": { color: "#63b3ed" } }}
                    >
                      {showNew
                        ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                        : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />
          </Box>

          {/* Password Strength */}
          {form.newPassword.length > 0 && (
            <Box sx={{ mb: 3, mt: 1.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.75 }}>
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.72rem", color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                }}>
                  Password Strength
                </Typography>
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.75rem", fontWeight: 700,
                  color: strength.color,
                }}>
                  {strength.label}
                </Typography>
              </Box>

              {/* Segmented bar */}
              <Box sx={{ display: "flex", gap: 0.6 }}>
                {[1, 2, 3, 4].map((seg) => (
                  <Box key={seg} sx={{
                    flex: 1, height: 4, borderRadius: 2,
                    backgroundColor: strength.score >= seg
                      ? strength.color
                      : "rgba(255,255,255,0.08)",
                    transition: "background-color 0.3s ease",
                  }} />
                ))}
              </Box>

              {/* Requirements */}
              <Box sx={{ mt: 1.5, display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                {[
                  { label: "8+ chars", met: form.newPassword.length >= 8 },
                  { label: "Uppercase", met: /[A-Z]/.test(form.newPassword) },
                  { label: "Number", met: /[0-9]/.test(form.newPassword) },
                  { label: "Symbol", met: /[^A-Za-z0-9]/.test(form.newPassword) },
                ].map((req) => (
                  <Box key={req.label} sx={{
                    display: "flex", alignItems: "center", gap: 0.4,
                    px: 1, py: 0.3, borderRadius: "6px",
                    backgroundColor: req.met ? "rgba(104,211,145,0.1)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${req.met ? "rgba(104,211,145,0.25)" : "rgba(255,255,255,0.08)"}`,
                    transition: "all 0.2s ease",
                  }}>
                    <CheckCircleOutlineIcon sx={{
                      fontSize: 11,
                      color: req.met ? "#68d391" : "rgba(255,255,255,0.2)",
                      transition: "color 0.2s ease",
                    }} />
                    <Typography sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.68rem",
                      color: req.met ? "#68d391" : "rgba(255,255,255,0.3)",
                      fontWeight: req.met ? 600 : 400,
                      transition: "color 0.2s ease",
                    }}>
                      {req.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {form.newPassword.length === 0 && <Box sx={{ mb: 3 }} />}

          {/* Submit Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || success || !form.currentPassword || !form.newPassword}
            endIcon={!loading && !success && <ArrowForwardIcon sx={{ fontSize: "16px !important" }} />}
            sx={{
              background: success
                ? "rgba(104,211,145,0.15)"
                : "linear-gradient(135deg, #4299e1, #3182ce)",
              borderRadius: "10px",
              textTransform: "none",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.95rem",
              py: 1.4,
              letterSpacing: "0.02em",
              boxShadow: "0 4px 20px rgba(66,153,225,0.3)",
              transition: "all 0.2s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #63b3ed, #4299e1)",
                boxShadow: "0 6px 28px rgba(66,153,225,0.5)",
                transform: "translateY(-1px)",
              },
              "&:disabled": {
                background: success ? "rgba(104,211,145,0.12)" : "rgba(255,255,255,0.06)",
                color: success ? "#68d391" : "rgba(255,255,255,0.2)",
                boxShadow: "none",
                transform: "none",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "rgba(255,255,255,0.6)" }} />
            ) : success ? (
              "Password Updated!"
            ) : (
              "Update Password"
            )}
          </Button>

          {/* Back link */}
          <Typography
            onClick={() => navigate(-1)}
            sx={{
              mt: 2.5, textAlign: "center",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.78rem", color: "rgba(255,255,255,0.25)",
              cursor: "pointer",
              transition: "color 0.15s ease",
              "&:hover": { color: "rgba(255,255,255,0.5)" },
            }}
          >
            ← Go back
          </Typography>
        </Box>

        {/* Footer */}
        <Typography sx={{
          mt: 4, textAlign: "center",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.72rem", color: "rgba(255,255,255,0.15)",
          letterSpacing: "0.05em",
        }}>
          © {new Date().getFullYear()} BookWithGyan · All rights reserved
        </Typography>
      </Box>
    </Box>
  );
}