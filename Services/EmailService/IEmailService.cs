namespace EventBookingSystem.Services.EmailService
{
    public interface IEmailService
    {
        Task SendAsync(string toEmail, string subject, string body);
    }
}