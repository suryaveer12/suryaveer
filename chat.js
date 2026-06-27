// StasisAi Support Chat Script

const FALLBACK_RESPONSES = {
    netlify: "Netlify deployment is highly optimized! Ensure your 'netlify.toml' configuration is present in the repository root. Variables should be set under Site Settings > Environment variables.",
    oauth: "To establish secure OAuth redirects, make sure the redirect URI in your credential console is configured to align with your platform URL (e.g. https://your-site.netlify.app/api/auth/callback).",
    latency: "Elevated network latency typically points to an unindexed database query or regional DNS routing lag. I recommend launching the Diagnostics Console and executing 'check-cores' to verify server status.",
    security: "System integrity audit has returned healthy results. Authentication nodes are fortified with HMAC-SHA256 tokens and request throttling is active across all endpoints.",
    hello: "Greetings Operator. StasisAi language model is fully active. How may I assist your diagnostics or configurations today?",
    help: "I am ready to consult on deployment architectures (Netlify/GitHub), API integrations, system debugging, or user state management."
};

function handleChatKey(event) {
    if (event.key === "Enter") {
        submitMessage();
    }
}

function submitMessage() {
    const input = document.getElementById("chatInput");
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    appendMessage("user", text);
    input.value = "";

    // Show AI typing indicator simulation
    const chatMsgs = document.getElementById("chatMessages");
    const loaderId = "loader-" + Date.now();
    
    const loaderDiv = document.createElement("div");
    loaderDiv.className = "message assistant";
    loaderDiv.id = loaderId;
    loaderDiv.innerHTML = `
        <div class="message-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="message-content">
            <p><span class="pulse-dot-cyan"></span> Synthesizing reply...</p>
        </div>
    `;
    chatMsgs.appendChild(loaderDiv);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;

    // Simulate response delay
    setTimeout(() => {
        // Remove loader
        const loader = document.getElementById(loaderId);
        if (loader) loader.remove();

        const responseText = getSmartAIResponse(text);
        appendMessage("assistant", responseText);
    }, 1200);
}

function sendSuggestion(text) {
    appendMessage("user", text);
    submitMessageWithText(text);
}

function submitMessageWithText(text) {
    const chatMsgs = document.getElementById("chatMessages");
    const loaderId = "loader-" + Date.now();
    
    const loaderDiv = document.createElement("div");
    loaderDiv.className = "message assistant";
    loaderDiv.id = loaderId;
    loaderDiv.innerHTML = `
        <div class="message-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="message-content">
            <p><span class="pulse-dot-cyan"></span> Synthesizing reply...</p>
        </div>
    `;
    chatMsgs.appendChild(loaderDiv);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;

    setTimeout(() => {
        const loader = document.getElementById(loaderId);
        if (loader) loader.remove();

        const responseText = getSmartAIResponse(text);
        appendMessage("assistant", responseText);
    }, 1200);
}

function appendMessage(sender, text) {
    const chatMsgs = document.getElementById("chatMessages");
    if (!chatMsgs) return;

    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${sender}`;
    
    const avatarIcon = sender === "user" ? "fa-user-secret" : "fa-robot";
    const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    msgDiv.innerHTML = `
        <div class="message-avatar"><i class="fa-solid ${avatarIcon}"></i></div>
        <div class="message-content">
            <p>${escapeHtml(text)}</p>
            <span class="message-time">${timeLabel}</span>
        </div>
    `;

    chatMsgs.appendChild(msgDiv);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

function clearConversation() {
    const chatMsgs = document.getElementById("chatMessages");
    if (!chatMsgs) return;

    chatMsgs.innerHTML = `
        <div class="message assistant">
            <div class="message-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="message-content">
                <p>Greetings Operator. Conversation context cleared. Systems nominal. Ask me anything.</p>
                <span class="message-time">SYSTEM RESET</span>
            </div>
        </div>
    `;
}

function getSmartAIResponse(query) {
    const q = query.toLowerCase();
    
    if (q.includes("netlify") || q.includes("deploy")) {
        return FALLBACK_RESPONSES.netlify;
    } else if (q.includes("oauth") || q.includes("redirect") || q.includes("callback")) {
        return FALLBACK_RESPONSES.oauth;
    } else if (q.includes("latency") || q.includes("slow") || q.includes("performance") || q.includes("db") || q.includes("database")) {
        return FALLBACK_RESPONSES.latency;
    } else if (q.includes("security") || q.includes("credentials") || q.includes("key")) {
        return FALLBACK_RESPONSES.security;
    } else if (q.includes("hello") || q.includes("hi") || q.includes("stasis")) {
        return FALLBACK_RESPONSES.hello;
    } else {
        return "Command syntactically checked. I've logged: '" + query + "'. Under production conditions, this prompt is routed to Gemini-3.5-Flash to produce contextual support recommendations. To deploy this fully operational shell, upload these assets to a Netlify static site!";
    }
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
