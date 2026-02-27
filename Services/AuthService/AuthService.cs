using EventBookingSystem.DTOs.Auth;
using EventBookingSystem.Model;
using EventBookingSystem.Services.PasswordService;
using EventBookingSystem.Services.NotificationService;
using Microsoft.Extensions.Logging;

namespace EventBookingSystem.Services.AuthService;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordService _passwordService;
    private readonly IJwtService _jwtService;
    private readonly INotificationService _notificationService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUserRepository userRepository,
        IPasswordService passwordService,
        IJwtService jwtService,
        INotificationService notificationService,
        ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _passwordService = passwordService;
        _jwtService = jwtService;
        _notificationService = notificationService;
        _logger = logger;
    }

    // ✅ ADMIN creates employee + sends email
    public async Task<User> CreateEmployeeAsync(
        string name,
        string email,
        Department department)
    {
        var existing = await _userRepository.GetByEmailAsync(email);
        if (existing != null)
            throw new Exception("Email already exists");

        var tempPassword = Guid.NewGuid().ToString("N")[..8];

        var user = new User
        {
            Name = name,
            Email = email,
            PasswordHash = _passwordService.HashPassword(tempPassword),
            Role = "Employee",
            Department = department,
            IsFirstLogin = true,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveAsync();

        // 📧 SEND CREDENTIAL EMAIL
        await _notificationService.EmployeeCreatedAsync(user, tempPassword);

        _logger.LogInformation(
            "Employee {Email} created and notification sent",
            email);

        return user;
    }

    // ✅ LOGIN
    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email)
            ?? throw new Exception("Invalid email or password");

        if (!user.IsActive)
            throw new Exception("Account is disabled");

        var validPassword = _passwordService.VerifyPassword(
            dto.Password,
            user.PasswordHash);

        if (!validPassword)
            throw new Exception("Invalid email or password");

        return new LoginResponseDto
        {
            UserId = user.UserId,
            Role = user.Role,
            IsFirstLogin = user.IsFirstLogin,
            Token = _jwtService.GenerateToken(user)
        };
    }

    // ✅ CHANGE PASSWORD (FIRST LOGIN FLOW)
    public async Task ChangePasswordAsync(
        int userId,
        ChangePasswordDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId)
            ?? throw new Exception("User not found");

        var valid = _passwordService.VerifyPassword(
            dto.CurrentPassword,
            user.PasswordHash);

        if (!valid)
            throw new Exception("Current password is incorrect");

        user.PasswordHash =
            _passwordService.HashPassword(dto.NewPassword);

        user.IsFirstLogin = false;

        await _userRepository.SaveAsync();

        _logger.LogInformation(
            "Password changed for user {Email}",
            user.Email);
    }
}