namespace backend.Models;
using System.Text.Json.Serialization;
public class OnboardingTask
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public bool IsCompleted { get; set; } = false;
    public int EmployeeId { get; set; }
    [JsonIgnore] 
    public Employee? Employee { get; set; }
}