import { useEffect, useState } from "react";
import {
  getEventsApi,
  activateEventApi,
  deactivateEventApi,
} from "../api/eventApi";
import {
  Button,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Skeleton,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import BookmarksOutlinedIcon from "@mui/icons-material/BookmarksOutlined";

const NAV_ITEMS = [
  {
    label: "Manage Events",
    path: "/admin",
    icon: <EventNoteOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    label: "Manage Users",
    path: "/admin/add-user",
    icon: <PersonAddAltOutlinedIcon sx={{ fontSize: 18 }} />,
  },
];

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const loadEvents = async () => {
    try {
      const res = await getEventsApi();
      setEvents(res.data);
    } catch {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleActivate = async (id) => {
    try {
      await activateEventApi(id);
      loadEvents();
    } catch {
      setError("Failed to activate event");
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateEventApi(id);
      loadEvents();
    } catch {
      setError("Failed to deactivate event");
    }
  };

  const activeCount = events.filter((e) => e.isActive).length;
  const totalSeats = events.reduce((a, e) => a + (e.maxSeats || 0), 0);
  const totalBookings = events.reduce((a, e) => a + (e.confirmedCount || 0), 0);

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)" }}>
      <Navbar />

      <Box sx={{ display: "flex", minHeight: "calc(100vh - 68px)" }}>

        {/* ── Sidebar ── */}
        <Box
          sx={{
            width: 230,
            flexShrink: 0,
            background: "rgba(255,255,255,0.03)",
            borderRight: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            flexDirection: "column",
            pt: 4,
            pb: 3,
            px: 2,
          }}
        >
          <Typography sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            px: 1.5,
            mb: 2,
          }}>
            Navigation
          </Typography>

          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Box
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 1.5,
                  py: 1.2,
                  borderRadius: "10px",
                  mb: 0.5,
                  cursor: "pointer",
                  backgroundColor: isActive ? "rgba(99,179,237,0.12)" : "transparent",
                  border: `1px solid ${isActive ? "rgba(99,179,237,0.25)" : "transparent"}`,
                  color: isActive ? "#63b3ed" : "rgba(255,255,255,0.5)",
                  transition: "all 0.18s ease",
                  "&:hover": {
                    backgroundColor: "rgba(99,179,237,0.08)",
                    color: "#63b3ed",
                    borderColor: "rgba(99,179,237,0.15)",
                  },
                }}
              >
                {item.icon}
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.88rem",
                  fontWeight: isActive ? 600 : 400,
                  color: "inherit",
                }}>
                  {item.label}
                </Typography>
                {isActive && (
                  <Box sx={{
                    ml: "auto", width: 6, height: 6,
                    borderRadius: "50%", backgroundColor: "#63b3ed",
                  }} />
                )}
              </Box>
            );
          })}

          {/* Stat summary */}
          <Box sx={{ mt: "auto", mx: 0.5 }}>
            <Box sx={{
              background: "rgba(99,179,237,0.07)",
              border: "1px solid rgba(99,179,237,0.15)",
              borderRadius: "12px",
              p: 2,
            }}>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.68rem",
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                mb: 1.5,
              }}>
                Quick Stats
              </Typography>
              {[
                { label: "Total Events", value: events.length },
                { label: "Active", value: activeCount },
                { label: "Total Bookings", value: totalBookings },
              ].map((s) => (
                <Box key={s.label} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>
                    {s.label}
                  </Typography>
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#63b3ed" }}>
                    {s.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ── Main Content ── */}
        <Box sx={{ flex: 1, p: { xs: 3, md: 5 }, overflowX: "auto" }}>

          {/* Header Row */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4, flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography sx={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.8rem", fontWeight: 700,
                color: "#ffffff", lineHeight: 1.2,
              }}>
                Manage Events
              </Typography>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", mt: 0.5,
              }}>
                Create, edit, and control all events from here
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/admin/create")}
              sx={{
                background: "linear-gradient(135deg, #4299e1, #3182ce)",
                borderRadius: "10px",
                textTransform: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.88rem",
                px: 2.5, py: 1.1,
                boxShadow: "0 4px 18px rgba(66,153,225,0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg, #63b3ed, #4299e1)",
                  boxShadow: "0 6px 24px rgba(66,153,225,0.5)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Create Event
            </Button>
          </Box>

          {/* Stat Cards */}
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 2, mb: 4 }}>
            {[
              { label: "Total Events", value: events.length, color: "#63b3ed", bg: "rgba(99,179,237,0.1)", icon: <EventNoteOutlinedIcon /> },
              { label: "Active Events", value: activeCount, color: "#68d391", bg: "rgba(104,211,145,0.1)", icon: <PowerSettingsNewIcon /> },
              { label: "Total Seats", value: totalSeats, color: "#f6ad55", bg: "rgba(246,173,85,0.1)", icon: <ChairOutlinedIcon /> },
              { label: "Bookings Made", value: totalBookings, color: "#b794f4", bg: "rgba(183,148,244,0.1)", icon: <BookmarksOutlinedIcon /> },
            ].map((card) => (
              <Box key={card.label} sx={{
                backgroundColor: card.bg,
                border: `1px solid ${card.color}22`,
                borderRadius: "14px",
                p: 2.5,
                display: "flex", flexDirection: "column", gap: 1,
              }}>
                <Box sx={{ color: card.color, opacity: 0.8, display: "flex" }}>{card.icon}</Box>
                <Typography sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.8rem", fontWeight: 700,
                  color: card.color, lineHeight: 1,
                }}>
                  {card.value}
                </Typography>
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.75rem", color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.04em",
                }}>
                  {card.label}
                </Typography>
              </Box>
            ))}
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
                fontFamily: "'DM Sans', sans-serif",
                "& .MuiAlert-icon": { color: "#fc8181" },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Table Card */}
          <Box sx={{
            backgroundColor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            overflow: "hidden",
          }}>
            {/* Table Head */}
            <Box sx={{
              display: "grid",
              gridTemplateColumns: "2fr 1.5fr 1.6fr 1fr 0.8fr 1.8fr",
              px: 3, py: 1.5,
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              backgroundColor: "rgba(255,255,255,0.03)",
            }}>
              {["Title", "Location", "Date & Time", "Seats", "Status", "Actions"].map((h) => (
                <Typography key={h} sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.68rem", fontWeight: 700,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}>
                  {h}
                </Typography>
              ))}
            </Box>

            {/* Loading skeletons */}
            {loading && [1, 2, 3].map((n) => (
              <Box key={n} sx={{
                display: "grid",
                gridTemplateColumns: "2fr 1.5fr 1.6fr 1fr 0.8fr 1.8fr",
                px: 3, py: 2,
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                alignItems: "center", gap: 1,
              }}>
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} variant="text" sx={{ bgcolor: "rgba(255,255,255,0.06)", borderRadius: 1 }} />
                ))}
              </Box>
            ))}

            {/* Empty State */}
            {!loading && events.length === 0 && (
              <Box sx={{ py: 8, textAlign: "center" }}>
                <EventNoteOutlinedIcon sx={{ fontSize: 40, color: "rgba(255,255,255,0.15)", mb: 1.5 }} />
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.9rem", color: "rgba(255,255,255,0.3)",
                }}>
                  No events found. Create your first event!
                </Typography>
              </Box>
            )}

            {/* Rows */}
            {!loading && events.map((event, idx) => (
              <Box
                key={event.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.5fr 1.6fr 1fr 0.8fr 1.8fr",
                  px: 3, py: 2,
                  borderBottom: idx < events.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  alignItems: "center",
                  transition: "background 0.15s ease",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.02)" },
                }}
              >
                {/* Title */}
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.88rem", fontWeight: 600,
                  color: "#e2e8f0",
                }}>
                  {event.title}
                </Typography>

                {/* Location */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocationOnOutlinedIcon sx={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }} />
                  <Typography sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.82rem", color: "rgba(255,255,255,0.5)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {event.location}
                  </Typography>
                </Box>

                {/* Date */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CalendarMonthOutlinedIcon sx={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }} />
                  <Typography sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.8rem", color: "rgba(255,255,255,0.5)",
                  }}>
                    {new Date(event.eventDateTime).toLocaleString([], {
                      month: "short", day: "numeric", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </Typography>
                </Box>

                {/* Seats */}
                <Box>
                  <Typography sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.85rem", fontWeight: 600,
                    color: "#e2e8f0",
                  }}>
                    {event.confirmedCount}
                    <Typography component="span" sx={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", fontWeight: 400 }}>
                      /{event.maxSeats}
                    </Typography>
                  </Typography>
                  {/* Mini progress bar */}
                  <Box sx={{
                    mt: 0.5, height: 3, borderRadius: 2,
                    backgroundColor: "rgba(255,255,255,0.07)", width: "70%",
                  }}>
                    <Box sx={{
                      height: "100%", borderRadius: 2,
                      width: `${Math.min((event.confirmedCount / event.maxSeats) * 100, 100)}%`,
                      background: "linear-gradient(90deg, #63b3ed, #4299e1)",
                    }} />
                  </Box>
                </Box>

                {/* Status */}
                <Chip
                  label={event.isActive ? "Active" : "Off"}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: "0.68rem",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    backgroundColor: event.isActive
                      ? "rgba(104,211,145,0.12)"
                      : "rgba(255,255,255,0.06)",
                    border: `1px solid ${event.isActive ? "rgba(104,211,145,0.3)" : "rgba(255,255,255,0.1)"}`,
                    color: event.isActive ? "#68d391" : "rgba(255,255,255,0.35)",
                    "& .MuiChip-label": { px: 1 },
                  }}
                />

                {/* Actions */}
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Tooltip title="Edit Event" arrow>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/admin/edit/${event.id}`)}
                      sx={{
                        color: "rgba(255,255,255,0.4)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px", p: 0.6,
                        "&:hover": { color: "#63b3ed", borderColor: "rgba(99,179,237,0.4)", backgroundColor: "rgba(99,179,237,0.08)" },
                      }}
                    >
                      <EditOutlinedIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="View Bookings" arrow>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/admin/events/${event.id}/bookings`)}
                      sx={{
                        color: "rgba(255,255,255,0.4)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px", p: 0.6,
                        "&:hover": { color: "#b794f4", borderColor: "rgba(183,148,244,0.4)", backgroundColor: "rgba(183,148,244,0.08)" },
                      }}
                    >
                      <PeopleAltOutlinedIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Tooltip>

                  {event.isActive ? (
                    <Button
                      size="small"
                      onClick={() => handleDeactivate(event.id)}
                      sx={{
                        textTransform: "none",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.72rem", fontWeight: 600,
                        px: 1.2, py: 0.5,
                        borderRadius: "8px",
                        color: "#f6ad55",
                        border: "1px solid rgba(246,173,85,0.25)",
                        backgroundColor: "rgba(246,173,85,0.08)",
                        "&:hover": { backgroundColor: "rgba(246,173,85,0.15)", borderColor: "rgba(246,173,85,0.4)" },
                        minWidth: 0,
                      }}
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      onClick={() => handleActivate(event.id)}
                      sx={{
                        textTransform: "none",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.72rem", fontWeight: 600,
                        px: 1.2, py: 0.5,
                        borderRadius: "8px",
                        color: "#68d391",
                        border: "1px solid rgba(104,211,145,0.25)",
                        backgroundColor: "rgba(104,211,145,0.08)",
                        "&:hover": { backgroundColor: "rgba(104,211,145,0.15)", borderColor: "rgba(104,211,145,0.4)" },
                        minWidth: 0,
                      }}
                    >
                      Activate
                    </Button>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}