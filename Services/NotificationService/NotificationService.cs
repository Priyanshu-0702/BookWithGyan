using EventBookingSystem.Model;
using EventBookingSystem.Services.EmailService;

namespace EventBookingSystem.Services.NotificationService
{
    public class NotificationService : INotificationService
    {
        private readonly IEmailService _emailService;

        public NotificationService(IEmailService emailService)
        {
            _emailService = emailService;
        }

        public async Task EmployeeCreatedAsync(User user, string tempPassword)
        {
            await _emailService.SendAsync(
                user.Email,
                "Your Event Booking Account",
                $"""
                Hello {user.Name},

                Your account has been created.

                Temporary Password: {tempPassword}

                Please change your password on first login.
                """
            );
        }

        public async Task BookingConfirmedAsync(User user, Event ev)
        {
            await _emailService.SendAsync(
                user.Email,
                "Event Booking Confirmed",
                $"Your booking for '{ev.Title}' is CONFIRMED."
            );
        }

        public async Task BookingWaitlistedAsync(User user, Event ev)
        {
            await _emailService.SendAsync(
                user.Email,
                "Event Waitlisted",
                $"You are WAITLISTED for '{ev.Title}'."
            );
        }

        public async Task BookingCancelledAsync(User user, Event ev)
        {
            await _emailService.SendAsync(
                user.Email,
                "Booking Cancelled",
                $"Your booking for '{ev.Title}' has been cancelled."
            );
        }

        public async Task PromotedFromWaitlistAsync(User user, Event ev)
        {
            await _emailService.SendAsync(
                user.Email,
                "Booking Confirmed 🎉",
                $"You have been CONFIRMED for '{ev.Title}'."
            );
        }
    }
}