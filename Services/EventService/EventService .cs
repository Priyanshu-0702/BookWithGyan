using EventBookingSystem.DTOs;
using EventBookingSystem.DTOs.Event;
using EventBookingSystem.Model;

namespace EventBookingSystem.Services.EventService
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _eventRepository;
        private readonly ILogger<EventService> _logger;

        public EventService(
            IEventRepository eventRepository,
            ILogger<EventService> logger)
        {
            _eventRepository = eventRepository;
            _logger = logger;
        }

        public async Task<Event> CreateEventAsync(
    CreateEventDto dto,
    int adminId)
        {
            ValidateEvent(dto.EventDateTime, dto.MaxSeats);

            var ev = new Event
            {
                Title = dto.Title,
                Description = dto.Description,
                Location = dto.Location,
                EventDateTime = dto.EventDateTime,
                MaxSeats = dto.MaxSeats,
                IsActive = true,
                CreatedByAdminId = adminId,
                AllowedDepartment = dto.AllowedDepartment 
            };

            await _eventRepository.AddAsync(ev);
            await _eventRepository.SaveAsync();

            _logger.LogInformation(
                "Event {Title} created for department {Department}",
                ev.Title,
                ev.AllowedDepartment);

            return ev;
        }

        public async Task<Event> UpdateEventAsync(
            int eventId,
            UpdateEventDto dto)
        {
            var ev = await _eventRepository.GetByIdAsync(eventId)
                ?? throw new Exception("Event not found");

            ValidateEvent(dto.EventDateTime, dto.MaxSeats);

            ev.Title = dto.Title;
            ev.Description = dto.Description;
            ev.Location = dto.Location;
            ev.EventDateTime = dto.EventDateTime;
            ev.MaxSeats = dto.MaxSeats;
            ev.AllowedDepartment = dto.AllowedDepartment;

            await _eventRepository.SaveAsync();

            return ev;
        }



        public async Task ActivateEventAsync(int eventId)
        {
            var ev = await _eventRepository.GetByIdAsync(eventId)
                ?? throw new Exception("Event not found");

            ev.IsActive = true;
            await _eventRepository.SaveAsync();
        }

        public async Task DeactivateEventAsync(int eventId)
        {
            var ev = await _eventRepository.GetByIdAsync(eventId)
                ?? throw new Exception("Event not found");

            ev.IsActive = false;
            await _eventRepository.SaveAsync();
        }

        public async Task<List<EventBookingDto>> GetBookingsForEventAsync(int eventId)
        {
            var bookings = await _eventRepository
                .GetBookingsByEventIdAsync(eventId);

            if (bookings == null || !bookings.Any())
                return new List<EventBookingDto>();

            return bookings
                .OrderBy(b => b.Status) // Confirmed first
                .ThenBy(b => b.CreatedAt)
                .Select(b => new EventBookingDto
                {
                    BookingId = b.Id,
                    EmployeeId = b.EmployeeId,
                    EmployeeName = b.Employee.Name,
                    Email = b.Employee.Email,
                    Status = (int)b.Status,
                    CreatedAt = b.CreatedAt
                })
                .ToList();
        }

        private void ValidateEvent(DateTime eventDate, int seats)
        {
            if (eventDate <= DateTime.UtcNow)
                throw new Exception("Event must be in future");

            if (seats <= 0)
                throw new Exception("Seats must be greater than 0");
        }
    }
}
