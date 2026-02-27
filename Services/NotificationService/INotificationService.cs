using EventBookingSystem.Model;

namespace EventBookingSystem.Services.NotificationService
{
    public interface INotificationService
    {
        Task EmployeeCreatedAsync(User user, string tempPassword);
        Task BookingConfirmedAsync(User user, Event ev);
        Task BookingWaitlistedAsync(User user, Event ev);
        Task BookingCancelledAsync(User user, Event ev);
        Task PromotedFromWaitlistAsync(User user, Event ev);
    }
}