namespace EventBookingSystem.DTOs
{
    public class EventBookingDto
    {
        public int BookingId { get; set; }

        public int EmployeeId { get; set; }

        public string EmployeeName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public int Status { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}