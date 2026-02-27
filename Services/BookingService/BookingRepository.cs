using EventBookingSystem.Data;
using EventBookingSystem.Model;
using Microsoft.EntityFrameworkCore;

namespace EventBookingSystem.Services.BookingService
{
    public class BookingRepository : IBookingRepository
    {
        private readonly ApplicationDbContext _context;

        public BookingRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> GetConfirmedCountAsync(int eventId)
        {
            return await _context.Bookings
                .CountAsync(b => b.EventId == eventId &&
                                 b.Status == BookingStatus.Confirmed);
        }

        public async Task<Booking?> GetUserBookingAsync(int eventId, int userId)
        {
            return await _context.Bookings
                .FirstOrDefaultAsync(b =>
                    b.EventId == eventId &&
                    b.EmployeeId == userId);
        }

        public async Task<Booking?> GetNextWaitlistedAsync(int eventId)
        {
            return await _context.Bookings
                .Where(b => b.EventId == eventId &&
                            b.Status == BookingStatus.Waitlisted)
                .OrderBy(b => b.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task AddAsync(Booking booking)
        {
            await _context.Bookings.AddAsync(booking);
        }

        public async Task DeleteAsync(Booking booking)
        {
            _context.Bookings.Remove(booking);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}