// Simple Chat Interface
let chatMessages, userInput, sendButton;

document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing chat interface...');
  
  // Initialize elements
  chatMessages = document.getElementById('chatMessages');
  userInput = document.getElementById('userInput');
  sendButton = document.getElementById('sendButton');

  // Log element status
  console.log('Chat elements status:', {
    chatMessages: !!chatMessages,
    userInput: !!userInput,
    sendButton: !!sendButton
  });

  // Make sure elements exist
  if (!chatMessages || !userInput || !sendButton) {
    console.error('Required chat elements not found');
    return;
  }

  // Fix for Enter key
  userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserMessage();
    }
  });

  // Fix for send button
  sendButton.addEventListener('click', function(e) {
    e.preventDefault();
    handleUserMessage();
  });

  // Auto-resize textarea
  userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });

  // Focus input on load
  userInput.focus();
});

function handleUserMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  
  // Add user message
  addMessage(message, true);
  userInput.value = '';
  userInput.style.height = 'auto'; // Reset textarea height
  userInput.focus(); // Keep focus on input

  // Show thinking indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'message ai-message';
  typingIndicator.innerHTML = '<div class="message-content">AI is thinking...</div>';
  chatMessages.appendChild(typingIndicator);
  scrollToBottom();

  // Show development message after delay
  setTimeout(() => {
    typingIndicator.remove();
    addMessage("AI is currently under development and will be available soon. Thank you for your patience!");
  }, 1000);
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