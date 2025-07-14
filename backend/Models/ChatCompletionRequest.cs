namespace backend.Models
{
    public class ChatCompletionRequest
    {
        public object Model { get; set; }
        public object[] Messages { get; set; }
    }
}
