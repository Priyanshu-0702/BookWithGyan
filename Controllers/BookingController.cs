using EventBookingSystem.DTOs.Booking;
using EventBookingSystem.Services.BookingService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventBookingSystem.Controllers
{
    [ApiController]
    [Route("api/bookings")]
    [Authorize(Roles = "Employee")]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly ILogger<BookingController> _logger;

        public BookingController(
            IBookingService bookingService,
            ILogger<BookingController> logger)
        {
            _bookingService = bookingService;
            _logger = logger;
        }

        // ✅ Book an event
        [HttpPost("{eventId}")]
        public async Task<IActionResult> BookEvent(int eventId)
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            await _bookingService.BookEventAsync(eventId, userId);

            _logger.LogInformation(
                "User {UserId} booked event {EventId}",
                userId, eventId);

            return Ok("Booking successful");
        }

        // ❌ Cancel booking
        [HttpDelete("{eventId}")]
        public async Task<IActionResult> CancelBooking(int eventId)
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            await _bookingService.CancelBookingAsync(eventId, userId);

            _logger.LogInformation(
                "User {UserId} cancelled booking for event {EventId}",
                userId, eventId);

            return Ok("Booking cancelled");
        }

        [HttpGet("my")]
        public async Task<ActionResult<List<MyBookingDto>>> GetMyBookings()
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var bookings = await _bookingService.GetMyBookingsAsync(userId);

            return Ok(bookings);
        }
    }
}