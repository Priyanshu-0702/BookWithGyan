using EventBookingSystem.Data;
using EventBookingSystem.DTOs.Booking;
using EventBookingSystem.Model;
using EventBookingSystem.Services.NotificationService;
using Microsoft.EntityFrameworkCore;

namespace EventBookingSystem.Services.BookingService
{
    public class BookingService : IBookingService
    {
        private readonly ApplicationDbContext _context;
        private readonly IBookingRepository _bookingRepository;
        private readonly INotificationService _notificationService;

        public BookingService(
            ApplicationDbContext context,
            IBookingRepository bookingRepository,
            INotificationService notificationService)
        {
            _context = context;
            _bookingRepository = bookingRepository;
            _notificationService = notificationService;
        }

        // ✅ BOOK EVENT
        public async Task BookEventAsync(int eventId, int userId)
        {
            using var transaction =
                await _context.Database.BeginTransactionAsync();

            var ev = await _context.Events.FindAsync(eventId)
                ?? throw new Exception("Event not found");

            if (!ev.IsActive)
                throw new Exception("Event is not active");

            if (ev.EventDateTime <= DateTime.UtcNow)
                throw new Exception("Event already started");

            var user = await _context.Users.FindAsync(userId)
                ?? throw new Exception("User not found");

            // 🔐 Department restriction
            if (ev.AllowedDepartment != Department.All &&
                ev.AllowedDepartment != user.Department)
            {
                throw new Exception("Event restricted to another department");
            }

            var existing =
                await _bookingRepository.GetUserBookingAsync(eventId, userId);

            if (existing != null)
                throw new Exception("Already booked");

            var confirmedCount =
                await _bookingRepository.GetConfirmedCountAsync(eventId);

            var status = confirmedCount < ev.MaxSeats
                ? BookingStatus.Confirmed
                : BookingStatus.Waitlisted;

            var booking = new Booking
            {
                EventId = eventId,
                EmployeeId = userId,
                Status = status
            };

            await _bookingRepository.AddAsync(booking);
            await _bookingRepository.SaveAsync();

            // 📧 EMAIL NOTIFICATION
            if (status == BookingStatus.Confirmed)
            {
                await _notificationService
                    .BookingConfirmedAsync(user, ev);
            }
            else
            {
                await _notificationService
                    .BookingWaitlistedAsync(user, ev);
            }

            await transaction.CommitAsync();
        }

        // ✅ CANCEL BOOKING
        public async Task CancelBookingAsync(int eventId, int userId)
        {
            using var transaction =
                await _context.Database.BeginTransactionAsync();

            var booking =
                await _bookingRepository.GetUserBookingAsync(eventId, userId)
                ?? throw new Exception("Booking not found");

            var wasConfirmed =
                booking.Status == BookingStatus.Confirmed;

            var user = await _context.Users.FindAsync(userId)
                ?? throw new Exception("User not found");

            var ev = await _context.Events.FindAsync(eventId)
                ?? throw new Exception("Event not found");

            await _bookingRepository.DeleteAsync(booking);
            await _bookingRepository.SaveAsync();

            // 📧 CANCEL EMAIL
            await _notificationService
                .BookingCancelledAsync(user, ev);

            // 🔄 Promote waitlisted user
            if (wasConfirmed)
            {
                var next =
                    await _bookingRepository.GetNextWaitlistedAsync(eventId);

                if (next != null)
                {
                    next.Status = BookingStatus.Confirmed;
                    await _bookingRepository.SaveAsync();

                    var promotedUser =
                        await _context.Users.FindAsync(next.EmployeeId);

                    if (promotedUser != null)
                    {
                        await _notificationService
                            .PromotedFromWaitlistAsync(promotedUser, ev);
                    }
                }
            }

            await transaction.CommitAsync();
        }

        public async Task<List<MyBookingDto>> GetMyBookingsAsync(int userId)
        {
            return await _context.Bookings
                .Where(b => b.EmployeeId == userId)
                .Select(b => new MyBookingDto
                {
                    EventId = b.EventId,
                    Title = b.Event.Title,
                    EventDateTime = b.Event.EventDateTime,
                    Status = b.Status
                })
                .ToListAsync();
        }
    }
}