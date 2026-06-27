using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Employee> Employees { get; set; }
    public DbSet<OnboardingTask> OnboardingTasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Employee>().HasData(
            new Employee { Id = 1, FullName = "Alex Popescu", Role = "Junior Developer", Department = "Engineering" },
            new Employee { Id = 2, FullName = "Maria Ionescu", Role = "HR Specialist", Department = "HR" }
        );
        
        modelBuilder.Entity<OnboardingTask>().HasData(
            new OnboardingTask { Id = 1, Title = "Set up Slack account", Description = "Join the #general channel.", EmployeeId = 1, IsCompleted = false },
            new OnboardingTask { Id = 2, Title = "Meet the Manager", Description = "Schedule a 15-minute meeting on Google Meet.", EmployeeId = 1, IsCompleted = false }
        );
    }
}