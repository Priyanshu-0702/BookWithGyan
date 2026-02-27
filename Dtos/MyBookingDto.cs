using EventBookingSystem.Model;

namespace EventBookingSystem.DTOs.Booking;

public class MyBookingDto
{
    public int EventId { get; set; }
    public string Title { get; set; } = null!;
    public DateTime EventDateTime { get; set; }
    public BookingStatus Status { get; set; }
}