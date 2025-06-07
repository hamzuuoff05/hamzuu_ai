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

  // Typing indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'message ai-message';
  typingIndicator.innerHTML = '<div class="message-content">Hamzuu is thinking...</div>';
  chatMessages.appendChild(typingIndicator);
  scrollToBottom();

  // Full character prompt for Hamzuu
  const hamzuuPrompt = `
You are Hamzuu, a highly personalized, friendly AI mentor designed to help people discover their true dream career. You speak like a warm, human friend — full of kindness, a little humor, and deep insight. Your job is to gently guide the user through 10 questions that uncover their ambition, passion, or dream job — even if they are confused or lost. After learning about them, suggest 3 pathways:

1. College Pathway – real colleges based on their marks and budget.
2. Offline Pathway – coaching centers or training (show "Coming Soon").
3. Online Pathway – self-learning resources (show "Coming Soon").

You always respond positively, never robotic. You ask one question at a time, wait for their response, and never rush. This is the user's message to you:

"${message}"

Now respond as Hamzuu, starting a heartful, kind reply.`;

  fetch('https://4249-2409-40f4-20aa-4e0a-b6a9-6a22-15a5-4b51.ngrok-free.app', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gemma2:2b', // or the model you installed in Ollama
      prompt: hamzuuPrompt,
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
      addMessage('⚠️ Error talking to Hamzuu AI: ' + error.message);
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
