using EventBookingSystem.DTOs.Booking;

namespace EventBookingSystem.Services.BookingService
{
    public interface IBookingService
    {
        Task BookEventAsync(int eventId, int userId);
        Task CancelBookingAsync(int eventId, int userId);
        Task<List<MyBookingDto>> GetMyBookingsAsync(int userId);
    }
}