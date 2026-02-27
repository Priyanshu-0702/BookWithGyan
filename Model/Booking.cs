using EventBookingSystem.Model;

namespace EventBookingSystem.Model
{
    public class Booking
    {
        public int Id { get; set; }

        public int EventId { get; set; }
        public int EmployeeId { get; set; }

        public BookingStatus Status { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Event Event { get; set; } = null!;
        public User Employee { get; set; } = null!;
    }
}