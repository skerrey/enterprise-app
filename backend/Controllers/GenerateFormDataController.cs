using backend.Models;
using Microsoft.AspNetCore.Mvc;
using OpenAI;
using OpenAI.Chat;
using System.Text.Json;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GenerateFormDataController : ControllerBase
    {
        private readonly OpenAIClient _openAIClient;

        public GenerateFormDataController(OpenAIClient openAIClient)
        {
            _openAIClient = openAIClient;
        }

        [HttpGet]
        public async Task<IActionResult> GenerateFormData()
        {
            try
            {
                // Read available products from JSON file
                var productsJson = await System.IO.File.ReadAllTextAsync("data/products.json");
                var availableProducts = JsonSerializer.Deserialize<Product[]>(productsJson);

                // Read available cost centers from JSON file
                var costCentersJson = await System.IO.File.ReadAllTextAsync("data/cost-centers.json");
                var availableCostCenters = JsonSerializer.Deserialize<CostCenter[]>(costCentersJson);

                // Initialize random number generator
                var random = new Random();

                // Select random department and priority (1-3)
                var selectedDepartmentId = random.Next(1, 4); // 1-3
                var selectedPriorityId = random.Next(1, 4); // 1-3

                // Map IDs to values
                var departmentMap = new Dictionary<int, string>
                {
                    { 1, "engineering" },
                    { 2, "marketing" },
                    { 3, "finance" }
                };

                var priorityMap = new Dictionary<int, string>
                {
                    { 1, "low" },
                    { 2, "medium" },
                    { 3, "high" }
                };

                var selectedDepartment = departmentMap[selectedDepartmentId];
                var selectedPriority = priorityMap[selectedPriorityId];

                // Select 1 random cost center
                var selectedCostCenter = availableCostCenters[random.Next(availableCostCenters.Length)];

                // Select 3 random products
                var selectedProducts = availableProducts
                    .OrderBy(x => random.Next())
                    .Take(3)
                    .Select(p => {
                        var qty = random.Next(1, 4); // Generate quantity once
                        return new
                        {
                            label = p.Label,
                            quantity = qty,
                            price = p.Price,
                            total = p.Price * qty // Use same quantity for total
                        };
                    })
                    .ToArray();

                // Convert selected products to JSON string for the prompt
                var productsForPrompt = JsonSerializer.Serialize(selectedProducts, new JsonSerializerOptions { WriteIndented = true });

                // Define your TForm shape in the prompt
                var typeDef = @"
                type TForm = {
                  requestorName: string;
                  requestorEmail: string;
                  department: string;
                  employeeID: string;
                  onBehalfOf?: string;
                  requestTitle: string;
                  description: string;
                  requestedDate: string;
                  dueDate?: string;
                  priority: string;
                  products: {
                    label: string;
                    quantity: number;
                    price: number;
                    total: number;
                  }[];
                  budget: number;
                  costCenter: string;
                  attachments: { name: string }[];
                };";

                // Ask GPT to emit only JSON with specific products
                var prompt = $@"
                Generate a JSON object that matches the following TypeScript type definition:
                {typeDef}
                
                IMPORTANT: Use exactly these products with their quantities, prices, and totals:
                {productsForPrompt}

                IMPORTANT: Use exactly these values:
                - department: ""{selectedDepartment}""
                - priority: ""{selectedPriority}"" 
                - costCenter: ""{selectedCostCenter.value}""

                CRITICAL: Generate completely UNIQUE and VARIED names and emails each time:
                - requestorName: Use diverse, realistic full names from different cultures/backgrounds
                - requestorEmail: Create professional emails that match the names (firstname.lastname@company.com format)
                - employeeID: Generate a unique employee ID (format: EMP + 3-4 random digits)

                Generate realistic values for all other fields (requestorName, requestorEmail, employeeID, requestTitle, description, requestedDate, etc.). 
                Set budget to at least the sum of all product totals.

                IMPORTANT: For attachments, generate 1-3 realistic file names that MUST end with .pdf, .png, or .jpg extensions only.
                Examples: ""invoice_2024.pdf"", ""receipt_scan.jpg"", ""approval_form.pdf"", ""product_image.png""


                Do not include any additional text or explanations, just the JSON object.";

                // Create the chat request
                var chatRequest = new ChatRequest(
                    messages: new[]
                    {
                        new Message(Role.User, prompt)
                    },
                    model: "gpt-3.5-turbo",
                    maxTokens: 1000,
                    temperature: 0.7
                );

                // Make the request to OpenAI API
                var response = await _openAIClient.ChatEndpoint.GetCompletionAsync(chatRequest);

                if (response?.Choices?.Count > 0)
                {
                    var generatedJson = response.Choices[0].Message.Content;

                    // Validate that it's valid JSON
                    var formData = JsonSerializer.Deserialize<object>(generatedJson);

                    // Return the parsed JSON object directly (not wrapped)
                    return Ok(formData);
                }
                else
                {
                    return StatusCode(500, new { success = false, error = "No response from OpenAI" });
                }
            }
            catch (JsonException ex)
            {
                return BadRequest(new { success = false, error = "Invalid JSON response from OpenAI", details = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = "Internal server error", details = ex.Message });
            }
        }
    }
}