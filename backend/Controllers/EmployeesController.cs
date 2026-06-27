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
}