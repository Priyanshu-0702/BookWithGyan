import api from "./axios";

export const bookEventApi = (eventId) =>
  api.post(`/api/bookings/${eventId}`);

export const cancelBookingApi = (eventId) =>
  api.delete(`/api/bookings/${eventId}`);

export const getMyBookingsApi = () =>
  api.get("/api/bookings/my");

