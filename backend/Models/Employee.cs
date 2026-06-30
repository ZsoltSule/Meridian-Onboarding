namespace backend.Models;

public class Employee
{
    public int Id { get; set; }
    public required string FullName { get; set; }
    public required string Role { get; set; }
    public required string Department { get; set; }

    public string? OnsiteDays { get; set; }
    public string? AssignedBuddy { get; set; } 

    public List<OnboardingTask> OnboardingTasks { get; set; } = new();
}