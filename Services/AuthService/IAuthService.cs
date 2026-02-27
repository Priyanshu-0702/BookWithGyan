using EventBookingSystem.DTOs.Auth;
using EventBookingSystem.Model;

namespace EventBookingSystem.Services.AuthService;

public interface IAuthService
{
    Task<User> CreateEmployeeAsync(string name, string email, Department department);
    Task<LoginResponseDto> LoginAsync(LoginRequestDto dto);
    Task ChangePasswordAsync(int userId, ChangePasswordDto dto);
}
