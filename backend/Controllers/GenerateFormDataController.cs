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

                // Select 1 random cost center
                var selectedCostCenter = availableCostCenters[random.Next(availableCostCenters.Length)];

                // Select 3 random products
                var selectedProducts = availableProducts
                    .OrderBy(x => random.Next())
                    .Take(3)
                    .Select(p => new
                    {
                        quantity = random.Next(1, 4), // 1-3 quantity
                        total = p.price * random.Next(1, 4) // Will be recalculated in prompt
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
                
                IMPORTANT: Use exactly these products (do not change the product details):
                {productsForPrompt}

                IMPORTANT: Use exactly this cost center value: ""{selectedCostCenter.value}""
                
                For each product, make sure totalPrice = quantity * unitPrice.
                Generate realistic values for all other fields. The budget should be at least the sum of all product totalPrices.
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