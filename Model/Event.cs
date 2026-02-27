namespace EventBookingSystem.Model
{
    public class Event
    {
        public int Id { get; set; }

        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Location { get; set; } = null!;
        public DateTime EventDateTime { get; set; }
        public int MaxSeats { get; set; }
        public bool IsActive { get; set; } = true;
        public Department AllowedDepartment { get; set; }= Department.All;

        // 🔑 Foreign Key
        public int CreatedByAdminId { get; set; }

        // 🔗 Relationships
        public User CreatedByAdmin { get; set; } = null!;
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
