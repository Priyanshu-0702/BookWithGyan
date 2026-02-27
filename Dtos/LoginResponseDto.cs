namespace EventBookingSystem.DTOs.Auth;

public class LoginResponseDto
{
    public int UserId { get; set; }
    public string Token { get; set; } = null!;
    public string Role { get; set; } = null!;
    public bool IsFirstLogin { get; set; }
}
