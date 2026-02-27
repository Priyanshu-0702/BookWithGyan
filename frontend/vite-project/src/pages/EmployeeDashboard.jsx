import { useEffect, useState } from "react";
import { getEventsApi } from "../api/eventApi";
import {
  bookEventApi,
  cancelBookingApi,
  getMyBookingsApi,
} from "../api/bookingApi";
import {
  Button,
  Typography,
  Box,
  Chip,
  Alert,
  Skeleton,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined";
import BookmarksOutlinedIcon from "@mui/icons-material/BookmarksOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";

export default function EmployeeDashboard() {
  const [events, setEvents] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        getEventsApi(),
        getMyBookingsApi(),
      ]);
      setEvents(eventsRes.data.filter((e) => e.isActive));
      setMyBookings(bookingsRes.data);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBook = async (id) => {
    try {
      setError("");
      setActionLoading(id);
      await bookEventApi(id);
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || "Booking failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id) => {
    try {
      setError("");
      setActionLoading(id);
      await cancelBookingApi(id);
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || "Cancel failed");
    } finally {
      setActionLoading(null);
    }
  };

  const getBooking = (eventId) => myBookings.find((b) => b.eventId === eventId);

  const confirmedCount = myBookings.filter((b) => b.status === 1).length;
  const waitlistedCount = myBookings.filter((b) => b.status === 2).length;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)",
      }}
    >
      <Navbar />

      {/* Decorative blobs */}
      <Box sx={{
        position: "fixed", top: 100, right: -80,
        width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,179,237,0.06) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <Box sx={{
        position: "fixed", bottom: 0, left: -60,
        width: 280, height: 280, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(183,148,244,0.05) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 1100, mx: "auto", px: { xs: 2, md: 5 }, py: 5 }}>

        {/* Page Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography sx={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.9rem", fontWeight: 700,
              color: "#ffffff", lineHeight: 1.2,
            }}>
              Available Events
            </Typography>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", mt: 0.5,
            }}>
              Browse and book upcoming events
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<BookmarksOutlinedIcon sx={{ fontSize: "16px !important" }} />}
            onClick={() => navigate("/employee/bookings")}
            sx={{
              borderColor: "rgba(99,179,237,0.3)",
              color: "#63b3ed",
              textTransform: "none",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.85rem",
              borderRadius: "10px",
              px: 2.5, py: 1,
              "&:hover": {
                borderColor: "#63b3ed",
                backgroundColor: "rgba(99,179,237,0.08)",
              },
            }}
          >
            My Bookings
          </Button>
        </Box>

        {/* Summary Cards */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 2, mb: 4 }}>
          {[
            { label: "Available Events", value: events.length, color: "#63b3ed", bg: "rgba(99,179,237,0.08)", icon: <EventNoteOutlinedIcon /> },
            { label: "My Confirmed", value: confirmedCount, color: "#68d391", bg: "rgba(104,211,145,0.08)", icon: <CheckCircleOutlineIcon /> },
            { label: "Waitlisted", value: waitlistedCount, color: "#f6ad55", bg: "rgba(246,173,85,0.08)", icon: <HourglassEmptyOutlinedIcon /> },
            { label: "Total Bookings", value: myBookings.length, color: "#b794f4", bg: "rgba(183,148,244,0.08)", icon: <ConfirmationNumberOutlinedIcon /> },
          ].map((card) => (
            <Box key={card.label} sx={{
              backgroundColor: card.bg,
              border: `1px solid ${card.color}22`,
              borderRadius: "14px",
              p: 2.5,
              display: "flex", flexDirection: "column", gap: 0.75,
            }}>
              <Box sx={{ color: card.color, opacity: 0.75 }}>{card.icon}</Box>
              <Typography sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.8rem", fontWeight: 700,
                color: card.color, lineHeight: 1,
              }}>
                {card.value}
              </Typography>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.72rem", color: "rgba(255,255,255,0.4)",
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

        {/* Loading Skeletons */}
        {loading && (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
            {[1, 2, 3, 4].map((n) => (
              <Box key={n} sx={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px", p: 3,
              }}>
                <Skeleton variant="text" width="60%" sx={{ bgcolor: "rgba(255,255,255,0.06)", mb: 1 }} />
                <Skeleton variant="text" width="40%" sx={{ bgcolor: "rgba(255,255,255,0.04)", mb: 0.5 }} />
                <Skeleton variant="text" width="50%" sx={{ bgcolor: "rgba(255,255,255,0.04)", mb: 2 }} />
                <Skeleton variant="rectangular" height={36} sx={{ bgcolor: "rgba(255,255,255,0.06)", borderRadius: 2 }} />
              </Box>
            ))}
          </Box>
        )}

        {/* Empty State */}
        {!loading && events.length === 0 && (
          <Box sx={{
            textAlign: "center", py: 10,
            backgroundColor: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
          }}>
            <EventNoteOutlinedIcon sx={{ fontSize: 44, color: "rgba(255,255,255,0.12)", mb: 1.5 }} />
            <Typography sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.1rem", color: "rgba(255,255,255,0.3)", mb: 0.5,
            }}>
              No Active Events
            </Typography>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.82rem", color: "rgba(255,255,255,0.2)",
            }}>
              Check back later for upcoming events
            </Typography>
          </Box>
        )}

        {/* Event Cards Grid */}
        {!loading && events.length > 0 && (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
            {events.map((event) => {
              const booking = getBooking(event.id);
              const isFull = event.confirmedCount >= event.maxSeats;
              const isPast = new Date(event.eventDateTime) < new Date();
              const fillPercent = Math.min((event.confirmedCount / event.maxSeats) * 100, 100);
              const isActioning = actionLoading === event.id;

              const bookingStatus =
                booking?.status === 1 ? "confirmed"
                : booking?.status === 2 ? "waitlisted"
                : null;

              return (
                <Box
                  key={event.id}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: `1px solid ${
                      bookingStatus === "confirmed"
                        ? "rgba(104,211,145,0.2)"
                        : bookingStatus === "waitlisted"
                        ? "rgba(246,173,85,0.2)"
                        : "rgba(255,255,255,0.07)"
                    }`,
                    borderRadius: "16px",
                    overflow: "hidden",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  {/* Top accent bar */}
                  <Box sx={{
                    height: 3,
                    background:
                      bookingStatus === "confirmed"
                        ? "linear-gradient(90deg, #68d391, #38a169)"
                        : bookingStatus === "waitlisted"
                        ? "linear-gradient(90deg, #f6ad55, #ed8936)"
                        : isPast
                        ? "rgba(255,255,255,0.1)"
                        : "linear-gradient(90deg, #63b3ed, #4299e1)",
                  }} />

                  <Box sx={{ p: 3 }}>
                    {/* Title row */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Typography sx={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "1.1rem", fontWeight: 700,
                        color: "#e2e8f0", lineHeight: 1.3,
                        flex: 1, pr: 1,
                      }}>
                        {event.title}
                      </Typography>

                      {/* Status chip */}
                      {bookingStatus === "confirmed" && (
                        <Chip
                          icon={<CheckCircleOutlineIcon sx={{ fontSize: "12px !important", color: "#68d391 !important" }} />}
                          label="Confirmed"
                          size="small"
                          sx={{
                            height: 22, fontSize: "0.68rem",
                            fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                            backgroundColor: "rgba(104,211,145,0.12)",
                            border: "1px solid rgba(104,211,145,0.3)",
                            color: "#68d391",
                            "& .MuiChip-label": { px: 0.75 },
                          }}
                        />
                      )}
                      {bookingStatus === "waitlisted" && (
                        <Chip
                          icon={<HourglassEmptyOutlinedIcon sx={{ fontSize: "12px !important", color: "#f6ad55 !important" }} />}
                          label="Waitlisted"
                          size="small"
                          sx={{
                            height: 22, fontSize: "0.68rem",
                            fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                            backgroundColor: "rgba(246,173,85,0.12)",
                            border: "1px solid rgba(246,173,85,0.3)",
                            color: "#f6ad55",
                            "& .MuiChip-label": { px: 0.75 },
                          }}
                        />
                      )}
                      {isPast && !bookingStatus && (
                        <Chip
                          label="Ended"
                          size="small"
                          sx={{
                            height: 22, fontSize: "0.68rem",
                            fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                            backgroundColor: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.3)",
                            "& .MuiChip-label": { px: 0.75 },
                          }}
                        />
                      )}
                    </Box>

                    {/* Meta info */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, mb: 2.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <LocationOnOutlinedIcon sx={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }} />
                        <Typography sx={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.82rem", color: "rgba(255,255,255,0.5)",
                        }}>
                          {event.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <CalendarMonthOutlinedIcon sx={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }} />
                        <Typography sx={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.82rem", color: "rgba(255,255,255,0.5)",
                        }}>
                          {new Date(event.eventDateTime).toLocaleString([], {
                            weekday: "short", month: "short", day: "numeric",
                            year: "numeric", hour: "2-digit", minute: "2-digit",
                          })}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Seats Section */}
                    <Box sx={{ mb: 2.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.75 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <ChairOutlinedIcon sx={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }} />
                          <Typography sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.75rem", color: "rgba(255,255,255,0.35)",
                          }}>
                            Seats
                          </Typography>
                        </Box>
                        <Typography sx={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.78rem", fontWeight: 600,
                          color: isFull ? "#fc8181" : "rgba(255,255,255,0.55)",
                        }}>
                          {event.confirmedCount} / {event.maxSeats}
                          {isFull && "  · Full"}
                        </Typography>
                      </Box>

                      {/* Progress bar */}
                      <Box sx={{ height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.07)" }}>
                        <Box sx={{
                          height: "100%", borderRadius: 2,
                          width: `${fillPercent}%`,
                          background: fillPercent >= 100
                            ? "linear-gradient(90deg, #fc8181, #e53e3e)"
                            : fillPercent >= 75
                            ? "linear-gradient(90deg, #f6ad55, #ed8936)"
                            : "linear-gradient(90deg, #63b3ed, #4299e1)",
                          transition: "width 0.4s ease",
                        }} />
                      </Box>

                      <Typography sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.72rem", color: "rgba(255,255,255,0.28)",
                        mt: 0.5,
                      }}>
                        {event.maxSeats - event.confirmedCount} seat{event.maxSeats - event.confirmedCount !== 1 ? "s" : ""} remaining
                      </Typography>
                    </Box>

                    {/* Waitlist notice */}
                    {isFull && !booking && (
                      <Box sx={{
                        display: "flex", alignItems: "center", gap: 0.75,
                        backgroundColor: "rgba(252,129,129,0.07)",
                        border: "1px solid rgba(252,129,129,0.15)",
                        borderRadius: "8px", px: 1.5, py: 0.75, mb: 2,
                      }}>
                        <HourglassEmptyOutlinedIcon sx={{ fontSize: 13, color: "#fc8181" }} />
                        <Typography sx={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.75rem", color: "#fc8181",
                        }}>
                          Event is full — booking will add you to the waitlist
                        </Typography>
                      </Box>
                    )}

                    {/* Action Buttons */}
                    <Box sx={{ display: "flex", gap: 1.5, mt: "auto" }}>
                      {!booking && (
                        <Button
                          variant="contained"
                          fullWidth
                          disabled={isPast || isActioning}
                          onClick={() => handleBook(event.id)}
                          sx={{
                            background: isPast
                              ? "rgba(255,255,255,0.06)"
                              : "linear-gradient(135deg, #4299e1, #3182ce)",
                            borderRadius: "9px",
                            textTransform: "none",
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            py: 1,
                            boxShadow: isPast ? "none" : "0 4px 14px rgba(66,153,225,0.3)",
                            "&:hover": {
                              background: "linear-gradient(135deg, #63b3ed, #4299e1)",
                              boxShadow: "0 6px 20px rgba(66,153,225,0.45)",
                            },
                            "&:disabled": {
                              color: "rgba(255,255,255,0.2)",
                              background: "rgba(255,255,255,0.05)",
                            },
                          }}
                        >
                          {isPast ? "Event Ended" : isActioning ? "Booking..." : isFull ? "Join Waitlist" : "Book Now"}
                        </Button>
                      )}

                      {bookingStatus === "confirmed" && (
                        <Button
                          variant="contained"
                          fullWidth
                          disabled
                          startIcon={<CheckCircleOutlineIcon sx={{ fontSize: "16px !important" }} />}
                          sx={{
                            backgroundColor: "rgba(104,211,145,0.12)",
                            border: "1px solid rgba(104,211,145,0.25)",
                            color: "#68d391",
                            borderRadius: "9px",
                            textTransform: "none",
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            py: 1,
                            "&:disabled": { color: "#68d391", backgroundColor: "rgba(104,211,145,0.12)" },
                          }}
                        >
                          Booked
                        </Button>
                      )}

                      {bookingStatus === "waitlisted" && (
                        <Button
                          variant="contained"
                          fullWidth
                          disabled
                          startIcon={<HourglassEmptyOutlinedIcon sx={{ fontSize: "16px !important" }} />}
                          sx={{
                            backgroundColor: "rgba(246,173,85,0.1)",
                            border: "1px solid rgba(246,173,85,0.25)",
                            borderRadius: "9px",
                            textTransform: "none",
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            py: 1,
                            "&:disabled": { color: "#f6ad55", backgroundColor: "rgba(246,173,85,0.1)" },
                          }}
                        >
                          Waitlisted
                        </Button>
                      )}

                      {booking && (
                        <Tooltip title="Cancel your booking" arrow>
                          <Button
                            variant="outlined"
                            onClick={() => handleCancel(event.id)}
                            disabled={isActioning}
                            startIcon={<CancelOutlinedIcon sx={{ fontSize: "15px !important" }} />}
                            sx={{
                              borderColor: "rgba(252,129,129,0.25)",
                              color: "rgba(252,129,129,0.7)",
                              borderRadius: "9px",
                              textTransform: "none",
                              fontFamily: "'DM Sans', sans-serif",
                              fontWeight: 500,
                              fontSize: "0.82rem",
                              py: 1,
                              px: 2,
                              minWidth: "fit-content",
                              whiteSpace: "nowrap",
                              "&:hover": {
                                borderColor: "#fc8181",
                                color: "#fc8181",
                                backgroundColor: "rgba(252,129,129,0.08)",
                              },
                            }}
                          >
                            {isActioning ? "..." : "Cancel"}
                          </Button>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}