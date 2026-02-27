using EventBookingSystem.Model;

namespace EventBookingSystem.DTOs.Event;

public class EventListDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Location { get; set; } = null!;
    public DateTime EventDateTime { get; set; }
    public int MaxSeats { get; set; }
    public int ConfirmedCount { get; set; }
    public bool IsActive { get; set; }
    public Department AllowedDepartment { get; set; }
}