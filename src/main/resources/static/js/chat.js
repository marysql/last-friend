document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const form = document.getElementById('message-form');
    const userInput = document.getElementById('user-input');
    const messagesContainer = document.querySelector('.messages-container');
    const typingIndicator = document.getElementById('typing-indicator');
    const sendButton = document.getElementById('send-button');
    
    // Configurações
    const TYPING_DELAY = 1000; // 1 segundo de atraso para simular digitação
    const MESSAGE_DELAY = 300; // Tempo de animação das mensagens

    function formatTime(date) {
        return date.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    function createMessageElement(text, isBot = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isBot ? 'bot-message' : 'user-message'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const formattedText = text.replace(/\n/g, '<br>');
        const timeString = formatTime(new Date());
        
        contentDiv.innerHTML = `${formattedText}<span class="message-time">${timeString}</span>`;
        messageDiv.appendChild(contentDiv);
        
        return messageDiv;
    }

    function addMessage(text, isBot = false) {
        const messageElement = createMessageElement(text, isBot);
        messagesContainer.appendChild(messageElement);
        
        // Adiciona a classe de animação após um pequeno atraso
        setTimeout(() => {
            messageElement.classList.add('visible');
            scrollToBottom();
        }, 10);
    }
    
    function showTypingIndicator(show = true) {
        if (show) {
            typingIndicator.style.display = 'block';
        } else {
            typingIndicator.style.display = 'none';
        }
        scrollToBottom();
    }
    
    function scrollToBottom() {
        messagesContainer.scrollTo({
            top: messagesContainer.scrollHeight,
            behavior: 'smooth'
        });
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Adiciona a mensagem do usuário
        addMessage(message, false);
        userInput.value = '';
        
        // Mostra o indicador de digitação
        showTypingIndicator(true);
        
        try {
            const response = await fetch('/chat/perguntar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto: message })
            });
            
            if (!response.ok) throw new Error('Erro na resposta do servidor');
            
            const data = await response.text();
            
            // Simula um tempo de digitação
            await new Promise(resolve => setTimeout(resolve, TYPING_DELAY));
            showTypingIndicator(false);
            
            // Adiciona a resposta do bot com um pequeno atraso
            setTimeout(() => {
                addMessage(data, true);
            }, MESSAGE_DELAY);
            
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            showTypingIndicator(false);
            
            // Adiciona mensagem de erro
            setTimeout(() => {
                addMessage('Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.', true);
            }, MESSAGE_DELAY);
        }
    }

    // Event Listeners
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
    
    // Focar no input quando a página carregar
    if (userInput) {
        userInput.focus();
        
        // Configurar auto-expansão do textarea
        userInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }
    
    // Configurar observador de mutação para rolagem automática
    const observer = new MutationObserver(() => {
        scrollToBottom();
    });
    
    observer.observe(messagesContainer, {
        childList: true,
        subtree: true
    });
    
    // Rolar para baixo ao carregar a página
    scrollToBottom();
});
