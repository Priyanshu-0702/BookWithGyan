using EventBookingSystem.Model;


namespace EventBookingSystem.Services.AuthService;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIdAsync(int id);
    Task AddAsync(User user);
    Task SaveAsync();
}
