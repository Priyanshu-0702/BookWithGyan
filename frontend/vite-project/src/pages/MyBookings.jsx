import { useEffect, useState } from "react";
import { getMyBookingsApi } from "../api/bookingApi";
import {
  Box,
  Typography,
  Chip,
  Alert,
  Skeleton,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import BookmarksOutlinedIcon from "@mui/icons-material/BookmarksOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

const STATUS = {
  1: {
    label: "Confirmed",
    color: "#68d391",
    bg: "rgba(104,211,145,0.12)",
    border: "rgba(104,211,145,0.3)",
    barColor: "linear-gradient(90deg, #68d391, #38a169)",
    icon: <CheckCircleOutlineIcon sx={{ fontSize: "13px !important" }} />,
  },
  2: {
    label: "Waitlisted",
    color: "#f6ad55",
    bg: "rgba(246,173,85,0.12)",
    border: "rgba(246,173,85,0.3)",
    barColor: "linear-gradient(90deg, #f6ad55, #ed8936)",
    icon: <HourglassEmptyOutlinedIcon sx={{ fontSize: "13px !important" }} />,
  },
  3: {
    label: "Cancelled",
    color: "#fc8181",
    bg: "rgba(252,129,129,0.1)",
    border: "rgba(252,129,129,0.25)",
    barColor: "linear-gradient(90deg, #fc8181, #e53e3e)",
    icon: <CancelOutlinedIcon sx={{ fontSize: "13px !important" }} />,
  },
};

const StatusChip = ({ status }) => {
  const s = STATUS[status] || {
    label: "Unknown", color: "rgba(255,255,255,0.3)",
    bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)", icon: null,
  };
  return (
    <Chip
      icon={s.icon ? <Box sx={{ color: `${s.color} !important`, display: "flex", ml: "6px !important" }}>{s.icon}</Box> : undefined}
      label={s.label}
      size="small"
      sx={{
        height: 26, fontSize: "0.72rem",
        fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
        letterSpacing: "0.03em",
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        "& .MuiChip-label": { px: 1 },
      }}
    />
  );
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const res = await getMyBookingsApi();
        setBookings(res.data);
      } catch {
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const confirmed = bookings.filter((b) => b.status === 1).length;
  const waitlisted = bookings.filter((b) => b.status === 2).length;
  const cancelled = bookings.filter((b) => b.status === 3).length;

  const filtered = bookings.filter((b) => {
    const matchesSearch = b.title?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "confirmed" && b.status === 1) ||
      (filter === "waitlisted" && b.status === 2) ||
      (filter === "cancelled" && b.status === 3);
    return matchesSearch && matchesFilter;
  });

  const isPast = (dateStr) => new Date(dateStr) < new Date();

  const FILTERS = [
    { key: "all", label: "All", count: bookings.length },
    { key: "confirmed", label: "Confirmed", count: confirmed },
    { key: "waitlisted", label: "Waitlisted", count: waitlisted },
    { key: "cancelled", label: "Cancelled", count: cancelled },
  ];

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)" }}>
      <Navbar />

      {/* Blobs */}
      <Box sx={{
        position: "fixed", top: 80, right: -80, width: 300, height: 300,
        borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(circle, rgba(104,211,145,0.05) 0%, transparent 70%)",
      }} />
      <Box sx={{
        position: "fixed", bottom: 0, left: -60, width: 260, height: 260,
        borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(circle, rgba(99,179,237,0.05) 0%, transparent 70%)",
      }} />

      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 860, mx: "auto", px: { xs: 2, md: 4 }, py: 5 }}>

        {/* Back */}
        <Box
          onClick={() => navigate("/employee")}
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

        {/* Page Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 2, mb: 4 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: "9px",
                background: "rgba(104,211,145,0.1)",
                border: "1px solid rgba(104,211,145,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <BookmarksOutlinedIcon sx={{ color: "#68d391", fontSize: 18 }} />
              </Box>
              <Typography sx={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.8rem", fontWeight: 700, color: "#ffffff",
              }}>
                My Bookings
              </Typography>
            </Box>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.83rem", color: "rgba(255,255,255,0.35)", ml: 0.5,
            }}>
              Your personal event registration history
            </Typography>
          </Box>

          {!loading && (
            <Box sx={{
              display: "flex", alignItems: "center", gap: 1,
              px: 1.75, py: 0.75, borderRadius: "20px",
              backgroundColor: "rgba(104,211,145,0.08)",
              border: "1px solid rgba(104,211,145,0.2)",
            }}>
              <BookmarksOutlinedIcon sx={{ fontSize: 14, color: "#68d391" }} />
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.78rem", fontWeight: 700, color: "#68d391",
              }}>
                {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Stat Cards */}
        {!loading && (
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 2, mb: 4 }}>
            {[
              { label: "Total", value: bookings.length, color: "#63b3ed", bg: "rgba(99,179,237,0.08)", icon: <BookmarksOutlinedIcon /> },
              { label: "Confirmed", value: confirmed, color: "#68d391", bg: "rgba(104,211,145,0.08)", icon: <CheckCircleOutlineIcon /> },
              { label: "Waitlisted", value: waitlisted, color: "#f6ad55", bg: "rgba(246,173,85,0.08)", icon: <HourglassEmptyOutlinedIcon /> },
              { label: "Cancelled", value: cancelled, color: "#fc8181", bg: "rgba(252,129,129,0.07)", icon: <CancelOutlinedIcon /> },
            ].map((c) => (
              <Box key={c.label} sx={{
                backgroundColor: c.bg,
                border: `1px solid ${c.color}22`,
                borderRadius: "14px", p: 2.5,
                display: "flex", flexDirection: "column", gap: 0.75,
              }}>
                <Box sx={{ color: c.color, opacity: 0.75 }}>{c.icon}</Box>
                <Typography sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.8rem", fontWeight: 700,
                  color: c.color, lineHeight: 1,
                }}>
                  {c.value}
                </Typography>
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.72rem", color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.04em",
                }}>
                  {c.label}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

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

        {/* Search + Filter Bar */}
        {!loading && bookings.length > 0 && (
          <Box sx={{
            display: "flex", alignItems: "center", flexWrap: "wrap",
            gap: 2, mb: 3,
          }}>
            <TextField
              size="small"
              placeholder="Search by event title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon sx={{ fontSize: 16, color: "rgba(255,255,255,0.25)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: { xs: "100%", sm: 240 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "9px",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  color: "#e2e8f0",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.85rem",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                  "&:hover fieldset": { borderColor: "rgba(99,179,237,0.3)" },
                  "&.Mui-focused fieldset": { borderColor: "#63b3ed" },
                },
                "& input::placeholder": { color: "rgba(255,255,255,0.25)", opacity: 1 },
              }}
            />

            {/* Filter Pills */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {FILTERS.map((f) => (
                <Box
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  sx={{
                    display: "flex", alignItems: "center", gap: 0.6,
                    px: 1.5, py: 0.5, borderRadius: "20px", cursor: "pointer",
                    transition: "all 0.15s ease",
                    backgroundColor: filter === f.key ? "rgba(99,179,237,0.15)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${filter === f.key ? "rgba(99,179,237,0.35)" : "rgba(255,255,255,0.08)"}`,
                    color: filter === f.key ? "#63b3ed" : "rgba(255,255,255,0.35)",
                    "&:hover": {
                      backgroundColor: "rgba(99,179,237,0.1)",
                      borderColor: "rgba(99,179,237,0.25)",
                      color: "#63b3ed",
                    },
                  }}
                >
                  <Typography sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.75rem", fontWeight: filter === f.key ? 700 : 400,
                    color: "inherit",
                  }}>
                    {f.label}
                  </Typography>
                  <Box sx={{
                    px: 0.65, py: 0.05, borderRadius: "10px",
                    backgroundColor: filter === f.key ? "rgba(99,179,237,0.2)" : "rgba(255,255,255,0.08)",
                    fontSize: "0.65rem", fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                    color: "inherit",
                  }}>
                    {f.count}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Skeleton Cards */}
        {loading && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[1, 2, 3].map((n) => (
              <Box key={n} sx={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px", p: 3,
              }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                  <Skeleton variant="text" width="45%" sx={{ bgcolor: "rgba(255,255,255,0.07)" }} />
                  <Skeleton variant="rounded" width={80} height={26} sx={{ bgcolor: "rgba(255,255,255,0.06)", borderRadius: "20px" }} />
                </Box>
                <Skeleton variant="text" width="30%" sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
              </Box>
            ))}
          </Box>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <Box sx={{
            py: 9, textAlign: "center",
            backgroundColor: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "16px",
          }}>
            <BookmarksOutlinedIcon sx={{ fontSize: 42, color: "rgba(255,255,255,0.1)", mb: 1.5 }} />
            <Typography sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.05rem", color: "rgba(255,255,255,0.25)", mb: 0.5,
            }}>
              {search || filter !== "all" ? "No matching bookings" : "No bookings yet"}
            </Typography>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.8rem", color: "rgba(255,255,255,0.18)",
            }}>
              {search || filter !== "all"
                ? "Try adjusting your search or filter"
                : "Head to the dashboard to book an event"}
            </Typography>
          </Box>
        )}

        {/* Booking Cards */}
        {!loading && filtered.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filtered.map((booking) => {
              const past = isPast(booking.eventDateTime);
              const s = STATUS[booking.status];

              return (
                <Box
                  key={booking.eventId}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: `1px solid ${s ? s.border.replace("0.3", "0.15") : "rgba(255,255,255,0.07)"}`,
                    borderRadius: "16px",
                    overflow: "hidden",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 36px rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  {/* Top accent bar */}
                  <Box sx={{
                    height: 3,
                    background: s ? s.barColor : "rgba(255,255,255,0.08)",
                    opacity: past ? 0.4 : 1,
                  }} />

                  <Box sx={{
                    p: { xs: 2.5, md: 3 },
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                    flexWrap: "wrap",
                  }}>
                    {/* Left: info */}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <EventNoteOutlinedIcon sx={{ fontSize: 16, color: "rgba(255,255,255,0.25)" }} />
                        <Typography sx={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: "1.05rem", fontWeight: 700,
                          color: past ? "rgba(255,255,255,0.45)" : "#e2e8f0",
                        }}>
                          {booking.title}
                        </Typography>
                        {past && (
                          <Box sx={{
                            px: 1, py: 0.2, borderRadius: "6px",
                            backgroundColor: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}>
                            <Typography sx={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: "0.62rem", fontWeight: 700,
                              color: "rgba(255,255,255,0.25)",
                              letterSpacing: "0.06em", textTransform: "uppercase",
                            }}>
                              Past
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <CalendarMonthOutlinedIcon sx={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }} />
                        <Typography sx={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.82rem",
                          color: past ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.5)",
                        }}>
                          {new Date(booking.eventDateTime).toLocaleString([], {
                            weekday: "short", month: "short", day: "numeric",
                            year: "numeric", hour: "2-digit", minute: "2-digit",
                          })}
                        </Typography>
                      </Box>

                      {/* Countdown or time-ago */}
                      {!past && booking.status === 1 && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mt: 1 }}>
                          <AccessTimeOutlinedIcon sx={{ fontSize: 12, color: "#68d391" }} />
                          <Typography sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.72rem", color: "#68d391", fontWeight: 500,
                          }}>
                            Upcoming event
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Right: status */}
                    <StatusChip status={booking.status} />
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Result count when filtering */}
        {!loading && (search || filter !== "all") && filtered.length > 0 && (
          <Typography sx={{
            mt: 2, textAlign: "right",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.74rem", color: "rgba(255,255,255,0.22)",
          }}>
            Showing {filtered.length} of {bookings.length} bookings
          </Typography>
        )}
      </Box>
    </Box>
  );
}