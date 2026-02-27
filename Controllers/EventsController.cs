using EventBookingSystem.Data;
using EventBookingSystem.DTOs.Event;
using EventBookingSystem.Model;
using EventBookingSystem.Services.EventService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EventBookingSystem.Controllers;

[ApiController]
[Route("api/events")]
[Authorize(Roles = "Employee,ADMIN")]
public class EventsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IEventService _eventService;

    public EventsController(
        ApplicationDbContext context,
        IEventService eventService)
    {
        _context = context;
        _eventService = eventService;
    }

    // 🔥 ADMIN ONLY — Get bookings for event
    [HttpGet("{id}/bookings")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> GetBookingsForEvent(int id)
    {
        var result = await _eventService
            .GetBookingsForEventAsync(id);

        return Ok(result);
    }

    // 🔥 Shared for Employee + Admin
    [HttpGet]
    public async Task<ActionResult<List<EventListDto>>> GetEvents()
    {
        var now = DateTime.UtcNow;

        var events = await _context.Events
            .Where(e => e.EventDateTime > now)
            .Select(e => new EventListDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                Location = e.Location,
                EventDateTime = e.EventDateTime,
                MaxSeats = e.MaxSeats,
                ConfirmedCount = e.Bookings
                    .Count(b => b.Status == BookingStatus.Confirmed),
                IsActive = e.IsActive,
                AllowedDepartment = e.AllowedDepartment
            })
            .ToListAsync();

        return Ok(events);
    }
}