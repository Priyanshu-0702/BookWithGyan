using EventBookingSystem.Model;

namespace EventBookingSystem.DTOs.Event
{
    public class CreateEventDto
    {
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Location { get; set; } = null!;
        public DateTime EventDateTime { get; set; }
        public int MaxSeats { get; set; }

        // UI sends this (defaults to All)
        public Department AllowedDepartment { get; set; } = Department.All;
    }
}