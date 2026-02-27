using EventBookingSystem.Model;

namespace EventBookingSystem.Dtos
{
    public class CreateEmployeeDto
    {
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public Department Department { get; set; }
    }
}
