import api from "./axios";

export const getEventsApi = () =>
  api.get("/api/events");

export const createEventApi = (data) =>
  api.post("/api/admin/events", data);

export const updateEventApi = (id, data) =>
  api.put(`/api/admin/events/${id}`, data);

export const activateEventApi = (id) =>
  api.patch(`/api/admin/events/${id}/activate`);

export const deactivateEventApi = (id) =>
  api.patch(`/api/admin/events/${id}/deactivate`);

export const getEventBookingsApi = (id) =>
  api.get(`/api/admin/events/${id}/bookings`);
