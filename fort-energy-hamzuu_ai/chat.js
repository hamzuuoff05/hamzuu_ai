// Minimal Chat Interface with GPT-2
const API_URL = 'https://api-inference.huggingface.co/models/openai-community/gpt2';

let chatMessages, userInput, sendButton;

document.addEventListener('DOMContentLoaded', function() {
  chatMessages = document.getElementById('chatMessages');
  userInput = document.getElementById('userInput');
  sendButton = document.getElementById('sendButton');

  userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserMessage();
    }
  });

  sendButton.addEventListener('click', handleUserMessage);
});

async function handleUserMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  
  addMessage(message, true);
  userInput.value = '';

  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'message ai-message';
  typingIndicator.innerHTML = '<div class="message-content">AI is thinking...</div>';
  chatMessages.appendChild(typingIndicator);
  scrollToBottom();

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: message,
        parameters: {
          max_new_tokens: 50,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false
        }
      })
    });

    typingIndicator.remove();
    
    if (!response.ok) {
      console.error('API Error:', response.status);
      addMessage("AI is currently under development and will be available soon. Thank you for your patience!");
      return;
    }

    const data = await response.json();
    if (!data || !data.generated_text) {
      addMessage("AI is currently under development and will be available soon. Thank you for your patience!");
      return;
    }

    const cleanResponse = data.generated_text
      .replace(/<|endoftext|>/g, '')
      .trim();

    addMessage(cleanResponse);
  } catch (error) {
    console.error('Error:', error);
    typingIndicator.remove();
    addMessage("AI is currently under development and will be available soon. Thank you for your patience!");
  }
}

function addMessage(message, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.textContent = message;
  messageDiv.appendChild(contentDiv);
  chatMessages.appendChild(messageDiv);
  scrollToBottom();
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Minimal Styles
const style = document.createElement('style');
style.textContent = `
  .chat-container {
    max-width: 500px;
    margin: 20px auto;
    font-family: system-ui, -apple-system, sans-serif;
  }
  .chat-box {
    background: #f5f5f5;
    border-radius: 8px;
    height: 500px;
    display: flex;
    flex-direction: column;
  }
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
  }
  .chat-input-container {
    padding: 10px;
    background: #fff;
    border-top: 1px solid #ddd;
    display: flex;
    gap: 8px;
  }
  #userInput {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
  .send-button {
    padding: 8px 16px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .message {
    margin: 4px 0;
  }
  .message-content {
    padding: 8px 12px;
    border-radius: 8px;
    max-width: 80%;
    display: inline-block;
  }
  .ai-message .message-content {
    background: #e9ecef;
  }
  .user-message {
    text-align: right;
  }
  .user-message .message-content {
    background: #007bff;
    color: white;
  }
`;
document.head.appendChild(style);