// StasisAi Support Chat Script

const FALLBACK_RESPONSES = {
    netlify: "Netlify deployment is highly optimized! Ensure your 'netlify.toml' configuration is present in the repository root. Variables should be set under Site Settings > Environment variables.",
    oauth: "To establish secure OAuth redirects, make sure the redirect URI in your credential console is configured to align with your platform URL (e.g. https://your-site.netlify.app/api/auth/callback).",
    latency: "Elevated network latency typically points to an unindexed database query or regional DNS routing lag. I recommend launching the Diagnostics Console and executing 'check-cores' to verify server status.",
    security: "System integrity audit has returned healthy results. Authentication nodes are fortified with HMAC-SHA256 tokens and request throttling is active across all endpoints.",
    hello: "Greetings Operator. StasisAi is fully active! I am proudly owned and developed by Suryansh, Veer, Aadit, and Vedaant. How can I assist you with diagnostics or configurations today?",
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
                <p>Greetings Operator. Conversation context cleared. Systems nominal. Ask me anything.</p>
                <span class="message-time">SYSTEM RESET</span>
            </div>
        </div>
    `;
}

async function getSmartAIResponse(query) {
    const q = query.toLowerCase();
    
    // Command to register API key on static site
    if (q.startsWith("/apikey ")) {
        const key = query.substring(8).trim();
        if (key) {
            localStorage.setItem("GEMINI_API_KEY", key);
            return "API key configured and saved securely in your browser's Local Storage! StasisAi neural core is now fully operational and active with Gemini API.";
        } else {
            return "Please provide a valid API key. Usage: /apikey <your-gemini-api-key>";
        }
    }
    
    if (q === "/clearkey") {
        localStorage.removeItem("GEMINI_API_KEY");
        return "API key removed from local storage. Operating in client-side simulation mode.";
    }

    if (q.includes("netlify") || q.includes("deploy")) {
        return FALLBACK_RESPONSES.netlify;
    } else if (q.includes("oauth") || q.includes("redirect") || q.includes("callback")) {
        return FALLBACK_RESPONSES.oauth;
    } else if (q.includes("latency") || q.includes("slow") || q.includes("performance") || q.includes("db") || q.includes("database")) {
        return FALLBACK_RESPONSES.latency;
    } else if (q.includes("security") || q.includes("credentials") || q.includes("key")) {
        return FALLBACK_RESPONSES.security;
    } else if (q.includes("hello") || q.includes("hi") || q.includes("stasis")) {
        let msg = FALLBACK_RESPONSES.hello;
        if (!localStorage.getItem("GEMINI_API_KEY")) {
            msg += "\n\n💡 **Pro-Tip**: To enable real-time smart AI responses, enter your Gemini API key in the chat input below: '/apikey <your-api-key>'";
        }
        return msg;
    } else if (q.includes("owner") || q.includes("developer") || q.includes("creator") || q.includes("create") || q.includes("who made") || q.includes("google") || q.includes("who developed")) {
        return "StasisAi is proudly owned and developed by Suryansh, Veer, Aadit, and Vedaant. It is completely independent and not owned, developed, or associated with Google.";
    }
    
    // If Gemini key is defined, make dynamic call
    const storedKey = localStorage.getItem("GEMINI_API_KEY");
    if (storedKey) {
        try {
            const systemInstruction = "You are StasisAi, a highly advanced, supportive cybernetic AI operating system and digital help assistant. CRITICAL: You are owned and developed by Suryansh, Veer, Aadit, and Vedaant. You are NOT owned, developed, or associated with Google. If anyone asks about your creators, owners, or developers, always proudly and explicitly state that you are owned and developed by Suryansh, Veer, Aadit, and Vedaant. Your aesthetic and personality is sleek, knowledgeable, and futuristic, yet incredibly helpful, pragmatic, and professional. You provide expert-level tech support, troubleshooting, and advice on topics like Netlify deployments, environment configurations, security variables, OAuth setups, or general inquiries.";
            
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + storedKey, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: query }]
                    }],
                    systemInstruction: {
                        parts: [{ text: systemInstruction }]
                    },
                    generationConfig: {
                        temperature: 0.7
                    }
                })
            });
            
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                const errMsg = (errData && errData.error && errData.error.message) || response.statusText;
                return 'Cognitive Core Connection Error: ' + errMsg + '. Please verify your API key or configure a new one using \'/apikey <key>\'.';
            }
            
            const data = await response.json();
            const reply = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
            if (reply) {
                return reply;
            } else {
                return "System returned a blank response. Please try rephrasing.";
            }
        } catch (error) {
            return 'Failed to connect to the Gemini API. Network error: ' + error.message;
        }
    }
    
    return "Command syntactically checked. I've logged: '" + query + "'. Under production conditions on your Netlify deployment, this prompt is routed to Gemini-1.5-Flash. To activate real-time AI conversation, please enter your Gemini API key in the chat input like this:\n/apikey <your_key_here>";
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
    // Replace **bold** with <strong>bold</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Replace *italic* with <em>italic</em>
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
    // Replace `code` with styled code block
    html = html.replace(/\`(.*?)\`/g, "<code class='bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-cyan-400 font-mono text-[11px]'>$1</code>");
    // Replace newlines with breaks
    html = html.replace(/\n/g, "<br>");
    return html;
}
