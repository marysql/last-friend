document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('message-form');
    const userInput = document.getElementById('user-input');
    const messagesContainer = document.getElementById('chat-messages');
    const typingIndicator = document.getElementById('typing-indicator');
    const sendButton = document.getElementById('send-button');

    function addMessage(text, messageClass) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${messageClass}`;
        const formattedText = text.replace(/\n/g, '<br>');
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        messageDiv.innerHTML = `${formattedText}<span class="message-time">${timeString}</span>`;
        messagesContainer.appendChild(messageDiv);
        messageDiv.scrollIntoView({ behavior: 'smooth' });
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        addMessage(message, 'user-message');
        userInput.value = '';
        typingIndicator.style.display = 'block';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        try {
            const response = await fetch('/chat/perguntar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto: message })
            });
            const data = await response.text();
            typingIndicator.style.display = 'none';
            setTimeout(() => {
                addMessage(data, 'bot-message');
            }, 300);
        } catch (error) {
            typingIndicator.style.display = 'none';
            addMessage('Desculpe, ocorreu um erro ao processar sua mensagem.', 'bot-message');
        }
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        sendMessage();
    });

    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    if (userInput) userInput.focus();
});
