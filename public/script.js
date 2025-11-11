const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  const botMessage = appendMessage('bot', 'Thinking...');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', text: userMessage }],
      }),
    });

    if (!response.ok) {
      // Use a more specific error message if possible
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || 'Failed to get response from server.';
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (data.result) {
      botMessage.textContent = data.result;
    } else {
      botMessage.textContent = 'Sorry, no response received.';
    }
  } catch (error) {
    botMessage.textContent = error.message || 'Failed to get response from server.';
    console.error('Error:', error);
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}