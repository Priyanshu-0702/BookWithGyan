import { useState, useContext } from "react";
import { loginApi } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import EventIcon from "@mui/icons-material/Event";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await loginApi(form);
      localStorage.setItem("token", res.data.token);
      await login(res.data.token);

      if (res.data.isFirstLogin) {
        navigate("/change-password");
      } else {
        navigate(res.data.role === "ADMIN" ? "/admin" : "/employee");
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "rgba(255,255,255,0.04)",
      color: "#e2e8f0",
      fontFamily: "'DM Sans', sans-serif",
      transition: "all 0.2s ease",
      "& fieldset": {
        borderColor: "rgba(255,255,255,0.1)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(99,179,237,0.4)",
      },
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
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#63b3ed",
    },
    "& .MuiInputAdornment-root .MuiSvgIcon-root": {
      color: "rgba(255,255,255,0.3)",
      fontSize: "1.1rem",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background circles */}
      <Box sx={{
        position: "absolute", top: "-120px", right: "-120px",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,179,237,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <Box sx={{
        position: "absolute", bottom: "-100px", left: "-100px",
        width: 350, height: 350, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(246,173,85,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <Box sx={{
        position: "absolute", top: "40%", left: "15%",
        width: 6, height: 6, borderRadius: "50%",
        backgroundColor: "rgba(99,179,237,0.4)",
        display: { xs: "none", md: "block" },
      }} />
      <Box sx={{
        position: "absolute", top: "20%", right: "20%",
        width: 4, height: 4, borderRadius: "50%",
        backgroundColor: "rgba(246,173,85,0.4)",
        display: { xs: "none", md: "block" },
      }} />

      {/* Left Branding Panel */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          px: 8,
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 6 }}>
          <Box sx={{
            width: 44, height: 44, borderRadius: "12px",
            background: "linear-gradient(135deg, #63b3ed, #4299e1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 20px rgba(99,179,237,0.4)",
          }}>
            <EventIcon sx={{ color: "#fff", fontSize: 22 }} />
          </Box>
          <Typography sx={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700, fontSize: "1.5rem",
            background: "linear-gradient(90deg, #ffffff 0%, #63b3ed 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            BookWithGyan
          </Typography>
        </Box>

        <Typography sx={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "2.6rem", fontWeight: 700,
          color: "#fff", lineHeight: 1.25, mb: 3,
          maxWidth: 380,
        }}>
          Manage Events with Ease & Precision
        </Typography>

        <Typography sx={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "1rem", color: "rgba(255,255,255,0.45)",
          lineHeight: 1.75, maxWidth: 360,
        }}>
          A unified platform for booking, managing, and overseeing events — built for teams and enterprises.
        </Typography>

        {/* Feature pills */}
        <Box sx={{ display: "flex", gap: 1.5, mt: 5, flexWrap: "wrap" }}>
          {["Real-time Booking", "Role-based Access", "Event Analytics"].map((f) => (
            <Box key={f} sx={{
              px: 2, py: 0.6,
              borderRadius: "20px",
              border: "1px solid rgba(99,179,237,0.2)",
              backgroundColor: "rgba(99,179,237,0.07)",
              color: "#63b3ed",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.03em",
            }}>
              {f}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right Login Panel */}
      <Box
        sx={{
          flex: { xs: 1, md: "0 0 460px" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: { xs: 3, md: 6 },
          py: 6,
        }}
      >
        {/* Mobile logo */}
        <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1.5, mb: 5 }}>
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
        <Box
          sx={{
            width: "100%",
            maxWidth: 380,
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            backdropFilter: "blur(20px)",
            p: { xs: 3.5, md: 4.5 },
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography sx={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.75rem", fontWeight: 700,
              color: "#ffffff", mb: 0.75,
            }}>
              Welcome back
            </Typography>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.88rem", color: "rgba(255,255,255,0.4)",
            }}>
              Sign in to your account to continue
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3, borderRadius: "10px",
                backgroundColor: "rgba(252,129,129,0.1)",
                border: "1px solid rgba(252,129,129,0.2)",
                color: "#fc8181",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.82rem",
                "& .MuiAlert-icon": { color: "#fc8181" },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Email Field */}
          <Box sx={{ mb: 2.5 }}>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.78rem", fontWeight: 600,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.06em", textTransform: "uppercase", mb: 1,
            }}>
              Email Address
            </Typography>
            <TextField
              fullWidth
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon />
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />
          </Box>

          {/* Password Field */}
          <Box sx={{ mb: 3.5 }}>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.78rem", fontWeight: 600,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.06em", textTransform: "uppercase", mb: 1,
            }}>
              Password
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "rgba(255,255,255,0.3)", "&:hover": { color: "#63b3ed" } }}
                    >
                      {showPassword
                        ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                        : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />
          </Box>

          {/* Submit Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !form.email || !form.password}
            endIcon={!loading && <ArrowForwardIcon sx={{ fontSize: "16px !important" }} />}
            sx={{
              background: "linear-gradient(135deg, #4299e1, #3182ce)",
              borderRadius: "10px",
              textTransform: "none",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.95rem",
              py: 1.4,
              letterSpacing: "0.02em",
              boxShadow: "0 4px 20px rgba(66,153,225,0.35)",
              transition: "all 0.2s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #63b3ed, #4299e1)",
                boxShadow: "0 6px 28px rgba(66,153,225,0.5)",
                transform: "translateY(-1px)",
              },
              "&:disabled": {
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.25)",
                boxShadow: "none",
                transform: "none",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "rgba(255,255,255,0.7)" }} />
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Footer note */}
          <Typography sx={{
            mt: 3, textAlign: "center",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.75rem", color: "rgba(255,255,255,0.25)",
          }}>
            Having trouble? Contact your administrator
          </Typography>
        </Box>

        {/* Bottom branding */}
        <Typography sx={{
          mt: 4, fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.72rem", color: "rgba(255,255,255,0.18)",
          letterSpacing: "0.05em",
        }}>
          © {new Date().getFullYear()} BookWithGyan · All rights reserved
        </Typography>
      </Box>
    </Box>
  );
}