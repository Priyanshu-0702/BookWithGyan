using EventBookingSystem.Model;

namespace EventBookingSystem.Services.BookingService
{
    public interface IBookingRepository
    {
        Task<int> GetConfirmedCountAsync(int eventId);
        Task<Booking?> GetUserBookingAsync(int eventId, int userId);
        Task<Booking?> GetNextWaitlistedAsync(int eventId);

        Task AddAsync(Booking booking);
        Task DeleteAsync(Booking booking);
        Task SaveAsync();
    }
}