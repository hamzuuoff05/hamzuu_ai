let chatMessages, userInput, sendButton;

document.addEventListener('DOMContentLoaded', function () {
  console.log('Initializing chat interface...');

  // Initialize elements
  chatMessages = document.getElementById('chatMessages');
  userInput = document.getElementById('userInput');
  sendButton = document.getElementById('sendButton');

  console.log('Chat elements status:', {
    chatMessages: !!chatMessages,
    userInput: !!userInput,
    sendButton: !!sendButton
  });

  if (!chatMessages || !userInput || !sendButton) {
    console.error('Required chat elements not found');
    return;
  }

  // Force scroll to top on page load
  window.scrollTo(0, 0);

  // Delay input focus to avoid auto-scroll to chat
  setTimeout(() => {
    userInput.focus();
  }, 500);

  // Send on Enter
  userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserMessage();
    }
  });

  // Send on button click
  sendButton.addEventListener('click', function (e) {
    e.preventDefault();
    handleUserMessage();
  });

  // Auto-resize textarea
  userInput.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });
});

function handleUserMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, true);
  userInput.value = '';
  userInput.style.height = 'auto';
  setTimeout(() => userInput.focus(), 300);

  // Show typing indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'message ai-message';
  typingIndicator.innerHTML = '<div class="message-content">AI is thinking...</div>';
  chatMessages.appendChild(typingIndicator);
  scrollToBottom();

  // Call LLaMA local server
  fetch('http://127.0.0.1:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gemma2:2b', // Replace with your actual model name if different
      prompt: message,
      stream: false
    })
  })
    .then(response => response.json())
    .then(data => {
      typingIndicator.remove();
      addMessage(data.response || '[No response received]');
    })
    .catch(error => {
      typingIndicator.remove();
      addMessage('⚠️ Error talking to LLaMA: ' + error.message);
    });
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