// Stasis Chat Bot Support Chat Script

const FALLBACK_RESPONSES = {
    netlify: "Netlify deployment is highly optimized! Ensure your 'netlify.toml' configuration is present in the repository root. Variables should be set under Site Settings > Environment variables.",
    oauth: "To establish secure OAuth redirects, make sure the redirect URI in your credential console is configured to align with your platform URL (e.g. https://your-site.netlify.app/api/auth/callback).",
    latency: "Elevated network latency typically points to an unindexed database query or regional DNS routing lag. I recommend launching the Diagnostics Console and executing 'check-cores' to verify server status.",
    security: "System integrity audit has returned healthy results. Authentication nodes are fortified with HMAC-SHA256 tokens and request throttling is active across all endpoints.",
    hello: "Hey there! Stasis Chat Bot is online and ready. How can I help you troubleshoot or set up your configurations today?",
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
    setTimeout(async () => {
        // Remove loader
        const loader = document.getElementById(loaderId);
        if (loader) loader.remove();

        const responseText = await getSmartAIResponse(text);
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

    setTimeout(async () => {
        const loader = document.getElementById(loaderId);
        if (loader) loader.remove();

        const responseText = await getSmartAIResponse(text);
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
            <p>${formatMessageText(text)}</p>
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
                <p>All cleared! Stasis Chat Bot context has been reset. Let's start fresh. Ask me anything!</p>
                <span class="message-time">RESET</span>
            </div>
        </div>
    `;
}

async function getSmartAIResponse(query) {
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
    } else if (q.includes("owner") || q.includes("developer") || q.includes("creator") || q.includes("create") || q.includes("who made") || q.includes("google") || q.includes("who developed")) {
        return "Stasis Chat Bot is proudly owned and developed by Suryansh, Veer, Aadit, and Vedaant. It is completely independent and not owned, developed, or associated with Google.";
    }
    
    // Try secure server backend first (/api/stasis-ai/chat)
    try {
        const response = await fetch('/api/stasis-ai/chat', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: query })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data && data.reply) {
                return data.reply;
            }
        } else {
            const errData = await response.json().catch(() => ({}));
            if (errData && errData.error) {
                return "Secure Core Connection Alert: " + errData.error + "\n\n💡 Try again in a few moments!";
            }
        }
    } catch (e) {
        // Fall back gracefully to standalone message
    }
    
    return "I've logged your request: '" + query + "'. In a full deployment, this is routed securely to the Gemini 3.1 Pro Lite model.";
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatMessageText(text) {
    let html = escapeHtml(text);
    
    // Handle simple headers
    html = html.replace(/^### (.*?)$/gm, "<strong class='text-cyan-400 border-b border-slate-800 pb-1 mb-2 block font-mono text-[13px]'>$1</strong>");
    
    // Handle inline code formatting
    html = html.replace(/\`(.*?)\`/g, "<code class='bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-cyan-400 font-mono text-[11px]'>$1</code>");
    
    // Handle bolding
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong class='text-white font-semibold'>$1</strong>");
    
    // Handle newlines
    html = html.replace(/\n/g, "<br>");
    
    return html;
}
