using EventBookingSystem.Data;
using EventBookingSystem.Model;
using Microsoft.EntityFrameworkCore;

namespace EventBookingSystem.Services.EventService
{
    public class EventRepository : IEventRepository
    {
        private readonly ApplicationDbContext _context;

        public EventRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Event?> GetByIdAsync(int id)
        {
            return await _context.Events
                .Include(e => e.Bookings)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task AddAsync(Event ev)
        {
            await _context.Events.AddAsync(ev);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<List<Booking>> GetBookingsByEventIdAsync(int eventId)
        {
            return await _context.Bookings
                .Include(b => b.Employee)   // 🔥 IMPORTANT
                .Where(b => b.EventId == eventId)
                .ToListAsync();
        }

    }
}
