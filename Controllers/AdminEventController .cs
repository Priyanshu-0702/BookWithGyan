using EventBookingSystem.DTOs.Event;
using EventBookingSystem.Services.EventService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/admin/events")]
[Authorize(Roles = "ADMIN")]
public class AdminEventController : ControllerBase
{
    private readonly IEventService _eventService;

    public AdminEventController(IEventService eventService)
    {
        _eventService = eventService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateEventDto dto)
    {
        var adminId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var ev = await _eventService.CreateEventAsync(dto, adminId);
        return Ok(ev);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateEventDto dto)
    {
        var ev = await _eventService.UpdateEventAsync(id, dto);
        return Ok(ev);
    }

    [HttpPatch("{id}/activate")]
    public async Task<IActionResult> Activate(int id)
    {
        await _eventService.ActivateEventAsync(id);
        return Ok("Activated");
    }

    [HttpPatch("{id}/deactivate")]
    public async Task<IActionResult> Deactivate(int id)
    {
        await _eventService.DeactivateEventAsync(id);
        return Ok("Deactivated");
    }

    [HttpGet("{id}/bookings")]
    public async Task<IActionResult> ViewBookings(int id)
    {
        var bookings = await _eventService.GetBookingsForEventAsync(id);
        return Ok(bookings);
    }
}