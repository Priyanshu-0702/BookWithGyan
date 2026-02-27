using EventBookingSystem.Model;
namespace EventBookingSystem.Services.AuthService
{
        public interface IJwtService
        {
            string GenerateToken(User user);
        }

    }


