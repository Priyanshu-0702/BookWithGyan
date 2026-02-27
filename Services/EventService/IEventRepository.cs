using EventBookingSystem.Model;

public interface IEventRepository
{
    Task<Event?> GetByIdAsync(int id);
    Task AddAsync(Event ev);
    Task SaveAsync();
    Task<List<Booking>> GetBookingsByEventIdAsync(int eventId);
}