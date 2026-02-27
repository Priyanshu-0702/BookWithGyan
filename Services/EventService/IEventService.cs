using EventBookingSystem.DTOs;
using EventBookingSystem.DTOs.Event;
using EventBookingSystem.Model;

namespace EventBookingSystem.Services.EventService
{
    public interface IEventService
    {
        Task<Event> CreateEventAsync(CreateEventDto dto, int adminId);
        Task<Event> UpdateEventAsync(int eventId, UpdateEventDto dto);
        Task ActivateEventAsync(int eventId);
        Task DeactivateEventAsync(int eventId);
        Task<List<EventBookingDto>> GetBookingsForEventAsync(int eventId);

    }
}
