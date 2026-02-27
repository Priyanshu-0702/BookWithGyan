using EventBookingSystem.Model;

namespace EventBookingSystem.DTOs.Auth;

public class UserProfileDto
{
    public int UserId { get; set; }
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Role { get; set; } = null!;
    public Department Department { get; set; }
    //public bool IsFirstLogin { get; set; }
}