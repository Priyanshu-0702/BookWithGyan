import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventBookingsApi } from "../api/eventApi";
import {
  Box,
  Typography,
  Chip,
  Alert,
  Skeleton,
  InputAdornment,
  TextField,
} from "@mui/material";
import Navbar from "../components/Navbar";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import BookmarksOutlinedIcon from "@mui/icons-material/BookmarksOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

const STATUS = {
  1: {
    label: "Confirmed",
    color: "#68d391",
    bg: "rgba(104,211,145,0.12)",
    border: "rgba(104,211,145,0.3)",
    icon: <CheckCircleOutlineIcon sx={{ fontSize: "12px !important" }} />,
  },
  2: {
    label: "Waitlisted",
    color: "#f6ad55",
    bg: "rgba(246,173,85,0.12)",
    border: "rgba(246,173,85,0.3)",
    icon: <HourglassEmptyOutlinedIcon sx={{ fontSize: "12px !important" }} />,
  },
  3: {
    label: "Cancelled",
    color: "#fc8181",
    bg: "rgba(252,129,129,0.1)",
    border: "rgba(252,129,129,0.25)",
    icon: <CancelOutlinedIcon sx={{ fontSize: "12px !important" }} />,
  },
};

const StatusChip = ({ status }) => {
  const s = STATUS[status] || {
    label: "Unknown", color: "rgba(255,255,255,0.3)",
    bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)",
    icon: null,
  };
  return (
    <Chip
      icon={s.icon ? <Box sx={{ color: `${s.color} !important`, display: "flex" }}>{s.icon}</Box> : undefined}
      label={s.label}
      size="small"
      sx={{
        height: 24, fontSize: "0.7rem",
        fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
        letterSpacing: "0.03em",
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        "& .MuiChip-label": { px: 1 },
        "& .MuiChip-icon": { ml: 0.75 },
      }}
    />
  );
};

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const AVATAR_COLORS = ["#63b3ed", "#b794f4", "#68d391", "#f6ad55", "#fc8181", "#76e4f7"];
const avatarColor = (name = "") =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export default function EventBookings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const res = await getEventBookingsApi(id);
        setBookings(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, [id]);

  const filtered = bookings.filter(
    (b) =>
      b.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
      b.email?.toLowerCase().includes(search.toLowerCase())
  );

  const confirmed = bookings.filter((b) => b.status === 1).length;
  const waitlisted = bookings.filter((b) => b.status === 2).length;
  const cancelled = bookings.filter((b) => b.status === 3).length;

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)" }}>
      <Navbar />

      {/* Blobs */}
      <Box sx={{
        position: "fixed", top: 80, right: -80, width: 300, height: 300,
        borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(circle, rgba(183,148,244,0.06) 0%, transparent 70%)",
      }} />
      <Box sx={{
        position: "fixed", bottom: 0, left: -60, width: 260, height: 260,
        borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(circle, rgba(99,179,237,0.05) 0%, transparent 70%)",
      }} />

      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 960, mx: "auto", px: { xs: 2, md: 4 }, py: 5 }}>

        {/* Back */}
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

        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 2, mb: 4 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: "9px",
                background: "rgba(183,148,244,0.1)",
                border: "1px solid rgba(183,148,244,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <PeopleAltOutlinedIcon sx={{ color: "#b794f4", fontSize: 18 }} />
              </Box>
              <Typography sx={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.8rem", fontWeight: 700, color: "#ffffff",
              }}>
                Event Bookings
              </Typography>
            </Box>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.83rem", color: "rgba(255,255,255,0.35)", ml: 0.5,
            }}>
              All registrations for this event
            </Typography>
          </Box>

          {/* Total badge */}
          {!loading && (
            <Box sx={{
              display: "flex", alignItems: "center", gap: 1,
              px: 1.75, py: 0.75,
              borderRadius: "20px",
              backgroundColor: "rgba(183,148,244,0.1)",
              border: "1px solid rgba(183,148,244,0.2)",
            }}>
              <BookmarksOutlinedIcon sx={{ fontSize: 14, color: "#b794f4" }} />
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.78rem", fontWeight: 700, color: "#b794f4",
              }}>
                {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Stat Cards */}
        {!loading && (
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 2, mb: 4 }}>
            {[
              { label: "Total", value: bookings.length, color: "#b794f4", bg: "rgba(183,148,244,0.08)", icon: <PeopleAltOutlinedIcon /> },
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

        {/* Table Card */}
        <Box sx={{
          backgroundColor: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "18px",
          overflow: "hidden",
        }}>
          {/* Search bar */}
          <Box sx={{
            px: { xs: 3, md: 4 }, py: 2.5,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap",
          }}>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.75rem", fontWeight: 700,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              Registrations
            </Typography>

            <TextField
              size="small"
              placeholder="Search by name or email..."
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
                width: { xs: "100%", sm: 260 },
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
          </Box>

          {/* Table Head */}
          <Box sx={{
            display: "grid",
            gridTemplateColumns: "2fr 2fr 1fr 1.5fr",
            px: { xs: 3, md: 4 }, py: 1.5,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            backgroundColor: "rgba(255,255,255,0.02)",
          }}>
            {["Employee", "Email", "Status", "Booked At"].map((h) => (
              <Typography key={h} sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.67rem", fontWeight: 700,
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                {h}
              </Typography>
            ))}
          </Box>

          {/* Loading skeletons */}
          {loading && [1, 2, 3, 4].map((n) => (
            <Box key={n} sx={{
              display: "grid",
              gridTemplateColumns: "2fr 2fr 1fr 1.5fr",
              px: { xs: 3, md: 4 }, py: 2,
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              alignItems: "center", gap: 2,
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: "rgba(255,255,255,0.06)", flexShrink: 0 }} />
                <Skeleton variant="text" width="60%" sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
              </Box>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="text" width="70%" sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
              ))}
            </Box>
          ))}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <Box sx={{ py: 9, textAlign: "center" }}>
              <PeopleAltOutlinedIcon sx={{ fontSize: 40, color: "rgba(255,255,255,0.1)", mb: 1.5 }} />
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.9rem", color: "rgba(255,255,255,0.25)",
              }}>
                {search ? "No bookings match your search." : "No bookings yet for this event."}
              </Typography>
            </Box>
          )}

          {/* Rows */}
          {!loading && filtered.map((b, idx) => (
            <Box
              key={b.bookingId}
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 2fr 1fr 1.5fr",
                px: { xs: 3, md: 4 }, py: 1.75,
                borderBottom: idx < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                alignItems: "center",
                transition: "background 0.15s ease",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.02)" },
              }}
            >
              {/* Employee Name */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{
                  width: 32, height: 32, borderRadius: "8px", flexShrink: 0,
                  background: `linear-gradient(135deg, ${avatarColor(b.employeeName)}, ${avatarColor(b.employeeName)}aa)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.65rem", fontWeight: 700,
                  color: "#fff", fontFamily: "'DM Sans', sans-serif",
                  boxShadow: `0 2px 8px ${avatarColor(b.employeeName)}33`,
                }}>
                  {getInitials(b.employeeName)}
                </Box>
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.88rem", fontWeight: 600,
                  color: "#e2e8f0",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {b.employeeName}
                </Typography>
              </Box>

              {/* Email */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <EmailOutlinedIcon sx={{ fontSize: 13, color: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.82rem", color: "rgba(255,255,255,0.45)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {b.email}
                </Typography>
              </Box>

              {/* Status */}
              <Box>
                <StatusChip status={b.status} />
              </Box>

              {/* Booked At */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <CalendarMonthOutlinedIcon sx={{ fontSize: 13, color: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.8rem", color: "rgba(255,255,255,0.4)",
                }}>
                  {b.createdAt
                    ? new Date(b.createdAt).toLocaleString([], {
                        month: "short", day: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })
                    : "—"}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Result count when searching */}
        {!loading && search && (
          <Typography sx={{
            mt: 2, textAlign: "right",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.75rem", color: "rgba(255,255,255,0.25)",
          }}>
            Showing {filtered.length} of {bookings.length} bookings
          </Typography>
        )}
      </Box>
    </Box>
  );
}