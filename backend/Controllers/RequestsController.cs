using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using System.Text.Json;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestsController : ControllerBase
    {
        //private static readonly List<Request> requests = new();
        private static readonly string dataPath = Path.Combine(Directory.GetCurrentDirectory(), "data", "requests.json");
        private static List<Request> requests = new List<Request>();

        private static List<Request> LoadRequestsFromFile()
        {
            try
            {
                if (!System.IO.File.Exists(dataPath))
                {
                    Console.WriteLine($"File does not exist: {dataPath}");
                    return new List<Request>();
                }

                var json = System.IO.File.ReadAllText(dataPath);
                Console.WriteLine($"Loading requests from {dataPath}");
                Console.WriteLine($"JSON content length: {json.Length}");

                if (string.IsNullOrWhiteSpace(json))
                {
                    Console.WriteLine("JSON file is empty");
                    return new List<Request>();
                }

                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                var result = JsonSerializer.Deserialize<List<Request>>(json, options);
                Console.WriteLine($"Successfully loaded {result?.Count ?? 0} requests");
                return result ?? new List<Request>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading requests: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return new List<Request>();
            }
        }

        private static void SaveRequestsToFile()
        {
            try
            {
                var directory = Path.GetDirectoryName(dataPath);
                Console.WriteLine($"Saving to directory: {directory}");
                Console.WriteLine($"Full file path: {dataPath}");

                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory!);
                    Console.WriteLine($"Created directory: {directory}");
                }

                var options = new JsonSerializerOptions
                {
                    WriteIndented = true,
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                var json = JsonSerializer.Serialize(requests, options);
                System.IO.File.WriteAllText(dataPath, json);

                Console.WriteLine($"File saved successfully to: {dataPath}");
                Console.WriteLine($"File size: {new FileInfo(dataPath).Length} bytes");

                // Verify the file was written
                if (System.IO.File.Exists(dataPath))
                {
                    var verification = System.IO.File.ReadAllText(dataPath);
                    Console.WriteLine($"Verification - file exists and contains {verification.Length} characters");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving file: {ex.Message}");
            }
        }

        [HttpPost]
        public IActionResult CreateRequest([FromBody] Request request)
        {
            try
            {
                // Ensure directory exists
                var directory = Path.GetDirectoryName(dataPath);
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory!);
                }

                // Load fresh data from file
                requests = LoadRequestsFromFile();

                // Generate new ID
                request.Id = requests.Count > 0 ? requests.Max(r => r.Id) + 1 : 1;

                // Add timestamp
                request.CreatedAt = DateTime.UtcNow;

                // Add to list
                requests.Add(request);

                // Save to file
                SaveRequestsToFile();

                Console.WriteLine($"Request saved with ID: {request.Id}");
                Console.WriteLine($"Total requests: {requests.Count}");

                return Ok(request);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving request: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, $"Error saving request: {ex.Message}");
            }
        }

        [HttpGet]
        public IActionResult GetAllRequests()
        {
            try
            {
                requests = LoadRequestsFromFile();
                return Ok(requests);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting requests: {ex.Message}");
                return StatusCode(500, new { message = $"Error getting requests: {ex.Message}" });
            }
        }

        [HttpGet("metrics")]
        public IActionResult GetAllRequestMetrics()
        {
            var json = System.IO.File.ReadAllText(dataPath);

            var metrics = new
            {
                TotalRequests = requests.Count,
                CompletedThisMonth = requests.Count(r => r.CreatedAt.Month == DateTime.UtcNow.Month && r.CreatedAt.Year == DateTime.UtcNow.Year),
                HighPriority = requests.Count(r => r.Priority.Equals("high", StringComparison.OrdinalIgnoreCase )),
            };  

            return Ok(metrics);
        }

        [HttpGet("timeline")]
        public IActionResult GetRequestTimeline()
        {
            try
            {
                var requests = LoadRequestsFromFile();

                // Group requests by month
                var monthlyData = requests
                    .GroupBy(r => new { r.CreatedAt.Year, r.CreatedAt.Month })
                    .OrderBy(g => g.Key.Year)
                    .ThenBy(g => g.Key.Month)
                    .Select(g => new {
                        month = $"{g.Key.Year}-{g.Key.Month:00}",
                        monthName = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy"),
                        totalRequests = g.Count(),
                        completedRequests = g.Count(r => r.Priority.Equals("low", StringComparison.OrdinalIgnoreCase)), // Mock completed
                        highPriorityRequests = g.Count(r => r.Priority.Equals("high", StringComparison.OrdinalIgnoreCase)),
                        avgBudget = g.Average(r => r.Budget)
                    })
                    .ToList();

                // Fill in missing months with 0 values if needed
                var result = new
                {
                    timeline = monthlyData,
                    summary = new
                    {
                        totalRequests = requests.Count,
                        avgMonthlyRequests = monthlyData.Count > 0 ? monthlyData.Average(m => m.totalRequests) : 0,
                        peakMonth = monthlyData.OrderByDescending(m => m.totalRequests).FirstOrDefault()?.monthName ?? "N/A"
                    }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetRequestById(int id)
        {
            var request = requests.FirstOrDefault(r => r.Id == id);
            if (request == null) return NotFound();
            return Ok(request);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateRequest(int id, [FromBody] Request request)
        {
            try
            {
                // Load fresh data from file
                requests = LoadRequestsFromFile();

                var existingRequest = requests.FirstOrDefault(r => r.Id == id);
                if (existingRequest == null)
                {
                    return NotFound(new { message = "Request not found" });
                }

                // Update the request properties
                existingRequest.RequestorName = request.RequestorName;
                existingRequest.RequestorEmail = request.RequestorEmail;
                existingRequest.Department = request.Department;
                existingRequest.EmployeeID = request.EmployeeID;
                existingRequest.OnBehalfOf = request.OnBehalfOf;
                existingRequest.RequestTitle = request.RequestTitle;
                existingRequest.Description = request.Description;
                existingRequest.RequestedDate = request.RequestedDate;
                existingRequest.DueDate = request.DueDate;
                existingRequest.Priority = request.Priority;
                existingRequest.Products = request.Products;
                existingRequest.Budget = request.Budget;
                existingRequest.CostCenter = request.CostCenter;
                existingRequest.Attachments = request.Attachments;

                // Save to file
                SaveRequestsToFile();

                Console.WriteLine($"Request updated with ID: {id}");
                return Ok(existingRequest);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating request: {ex.Message}");
                return StatusCode(500, new { message = $"Error updating request: {ex.Message}" });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteRequest(int id)
        {
            try
            {
                // Load fresh data from file
                requests = LoadRequestsFromFile();

                var request = requests.FirstOrDefault(r => r.Id == id);
                if (request == null)
                {
                    return NotFound(new { message = "Request not found" });
                }

                // Remove the request
                requests.Remove(request);

                // Save to file
                SaveRequestsToFile();

                Console.WriteLine($"Request deleted with ID: {id}");
                return Ok(new { message = "Request deleted successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting request: {ex.Message}");
                return StatusCode(500, new { message = $"Error deleting request: {ex.Message}" });
            }
        }
    }
}
