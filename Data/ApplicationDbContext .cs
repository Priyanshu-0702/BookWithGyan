using EventBookingSystem.Model;
using Microsoft.EntityFrameworkCore;

namespace EventBookingSystem.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<Booking> Bookings => Set<Booking>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 🔐 Seed Admin User
        modelBuilder.Entity<User>().HasData(
            new User
            {
                UserId = 1,
                Name = "Admin",
                Email = "admin@eventbooking.com",
                PasswordHash = "$2a$12$Eg.hBLin6r41OoZShBB6VOBdBwLCbUjIGE4WwKldyxmmjjN1w5pnW",
                Role = "ADMIN",
                Department = Department.All,
                IsActive = true,
                IsFirstLogin = false,
                CreatedAt = new DateTime(2026, 2, 19, 12, 17, 14, 234, DateTimeKind.Utc)
            }
        );

        // 🔒 Unique constraints
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Booking>()
            .HasIndex(b => new { b.EventId, b.EmployeeId })
            .IsUnique();

        // 👤 USER ↔ EVENT (Admin creates events)
        modelBuilder.Entity<Event>()
            .HasOne(e => e.CreatedByAdmin)
            .WithMany(u => u.CreatedEvents)
            .HasForeignKey(e => e.CreatedByAdminId)
            .OnDelete(DeleteBehavior.Restrict);

        // 📅 EVENT ↔ BOOKING
        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Event)
            .WithMany(e => e.Bookings)
            .HasForeignKey(b => b.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        // 👨‍💼 USER ↔ BOOKING (Employee books event)
        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Employee)
            .WithMany(u => u.Bookings)
            .HasForeignKey(b => b.EmployeeId)
            .OnDelete(DeleteBehavior.Restrict);


        modelBuilder.Entity<Booking>()
            .Property(b => b.Status)
            .HasConversion<int>();
    }
}