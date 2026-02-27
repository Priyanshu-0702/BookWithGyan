/**
 * ============================================================
 *  LOGO SETUP INSTRUCTIONS
 * ============================================================
 *  1. Take your logo image file (the one with the calendar +
 *     people icon and "BookWithGyan" text)
 *
 *  2. Rename it to: logo.png
 *
 *  3. Place it in your project at:
 *       YOUR_PROJECT/public/logo.png
 *
 *     (The /public folder is at the ROOT of your project,
 *      same level as /src, package.json, etc.)
 *
 *  4. That's it! The src="/logo.png" below will pick it up
 *     automatically. No import needed.
 * ============================================================
 */

import { AppBar, Toolbar, Typography, Button, Box, Avatar, Chip } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const displayName = isAdmin ? "Admin" : user?.name || "Guest";
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)",
        borderBottom: "1px solid rgba(99, 179, 237, 0.15)",
        backdropFilter: "blur(20px)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, md: 4 },
          py: 1,
          minHeight: "68px !important",
        }}
      >
        {/* ── LEFT — Logo Image ── */}
        {/*
         * WHERE TO PUT YOUR LOGO FILE:
         *   → Copy your logo image to:  <your-project>/public/logo.png
         *   → The /public folder is at the root of your project
         *     (same level as /src, package.json, vite.config.js, etc.)
         *
         * FOLDER STRUCTURE EXAMPLE:
         *   my-app/
         *   ├── public/
         *   │   └── logo.png   ← PUT IT HERE
         *   ├── src/
         *   │   ├── components/
         *   │   │   └── Navbar.jsx
         *   │   └── ...
         *   └── package.json
         */}
        <Box
          onClick={() => navigate(isAdmin ? "/admin" : "/employee")}
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            "&:hover img": {
              filter: "brightness(1.1) drop-shadow(0 0 10px rgba(99,179,237,0.3))",
            },
            "& img": {
              transition: "filter 0.2s ease",
            },
          }}
        >
          <img
            src="/logo.png"
            alt="BookWithGyan"
            style={{
              height: 46,
              width: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </Box>

        {/* ── RIGHT — User Info + Logout ── */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

          {/* Role Badge */}
          <Chip
            icon={
              isAdmin
                ? <AdminPanelSettingsIcon sx={{ fontSize: "14px !important", color: "#f6ad55 !important" }} />
                : <PersonIcon sx={{ fontSize: "14px !important", color: "#63b3ed !important" }} />
            }
            label={isAdmin ? "Admin" : "Member"}
            size="small"
            sx={{
              backgroundColor: isAdmin
                ? "rgba(246, 173, 85, 0.12)"
                : "rgba(99, 179, 237, 0.12)",
              border: `1px solid ${isAdmin ? "rgba(246,173,85,0.3)" : "rgba(99,179,237,0.3)"}`,
              color: isAdmin ? "#f6ad55" : "#63b3ed",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: "0.7rem",
              letterSpacing: "0.04em",
              height: 26,
              display: { xs: "none", sm: "flex" },
              "& .MuiChip-label": { px: 1 },
            }}
          />

          {/* Divider */}
          <Box
            sx={{
              width: 1,
              height: 28,
              backgroundColor: "rgba(255,255,255,0.1)",
              display: { xs: "none", sm: "block" },
            }}
          />

          {/* Avatar + Name */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Avatar
              sx={{
                width: 34,
                height: 34,
                fontSize: "0.78rem",
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                background: isAdmin
                  ? "linear-gradient(135deg, #f6ad55, #ed8936)"
                  : "linear-gradient(135deg, #63b3ed, #4299e1)",
                boxShadow: isAdmin
                  ? "0 2px 10px rgba(246,173,85,0.35)"
                  : "0 2px 10px rgba(99,179,237,0.35)",
              }}
            >
              {initials}
            </Avatar>

            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.85rem",
                  lineHeight: 1.2,
                }}
              >
                {isAdmin ? "Administrator" : displayName}
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "0.68rem",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {user?.email || "Logged in"}
              </Typography>
            </Box>
          </Box>

          {/* Logout Button */}
          <Button
            variant="outlined"
            startIcon={<LogoutIcon sx={{ fontSize: "16px !important" }} />}
            onClick={handleLogout}
            sx={{
              borderColor: "rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.8)",
              textTransform: "none",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: "0.82rem",
              borderRadius: "8px",
              px: 2,
              py: 0.75,
              letterSpacing: "0.02em",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#fc8181",
                color: "#fc8181",
                backgroundColor: "rgba(252,129,129,0.08)",
                boxShadow: "0 0 16px rgba(252,129,129,0.15)",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}