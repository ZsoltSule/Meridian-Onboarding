using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")] 
public class EmployeesController : ControllerBase
{
    private readonly AppDbContext _context;

    public EmployeesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetEmployees()
    {
        var employees = await _context.Employees
                                      .Include(e => e.OnboardingTasks)
                                      .ToListAsync();
        
        return Ok(employees);
    }
    [HttpPut("{employeeId}/tasks/{taskId}/toggle")]
    public async Task<IActionResult> ToggleTaskStatus(int employeeId, int taskId)
    {
        var task = await _context.OnboardingTasks
            .FirstOrDefaultAsync(t => t.Id == taskId && t.EmployeeId == employeeId);

        if (task == null)
        {
            return NotFound(new { message = "Task not found." });
        }
        task.IsCompleted = !task.IsCompleted;

        await _context.SaveChangesAsync();

        return Ok(task);
    }
}