using EventBookingSystem.Dtos;
using EventBookingSystem.DTOs.Auth;
using EventBookingSystem.Model;
using EventBookingSystem.Services.AuthService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventBookingSystem.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    // =========================================================
    // ADMIN → CREATE EMPLOYEE
    // =========================================================
    [Authorize(Roles = "ADMIN")]
    [HttpPost("create-employee")]
    public async Task<IActionResult> CreateEmployee(CreateEmployeeDto dto)
    {
        var user = await _authService.CreateEmployeeAsync(
            dto.Name,
            dto.Email,
            dto.Department);

        return Ok(new
        {
            user.UserId,
            user.Email,
            user.Department
        });
    }

    // =========================================================
    // LOGIN
    // =========================================================
    /* [AllowAnonymous]
     [HttpPost("login")]
     public async Task<IActionResult> Login(LoginRequestDto dto)
     {
         var response = await _authService.LoginAsync(dto);
         return Ok(response);
     }*/
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDto dto)
    {
        var response = await _authService.LoginAsync(dto);

        if (response == null)
            return Unauthorized("Invalid email or password");

        return Ok(response);
    }

    // =========================================================
    // CHANGE PASSWORD (FIRST LOGIN / NORMAL)
    // =========================================================
    [Authorize(Roles = "Employee")]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
    {
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await _authService.ChangePasswordAsync(userId, dto);

        return Ok("Password updated successfully");
    }

    // =========================================================
    // GET LOGGED-IN USER PROFILE (⭐ IMPORTANT FOR FRONTEND)
    // =========================================================
    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var Name = 
            User.FindFirstValue(ClaimTypes.Name)!;

        var email =
            User.FindFirstValue(ClaimTypes.Email)!;

        var role =
            User.FindFirstValue(ClaimTypes.Role)!;

        var department = Enum.Parse<Department>(
            User.FindFirst("department")!.Value);

        //var isFirstLogin =
        //    bool.Parse(User.FindFirst("isFirstLogin")!.Value);

        return Ok(new UserProfileDto
        {
            UserId = userId,
            Name = Name,
            Email = email,
            Role = role,
            Department = department,
            //IsFirstLogin = isFirstLogin
        });
    }
}