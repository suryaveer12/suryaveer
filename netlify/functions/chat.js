/**
 * Netlify Serverless Function: chat.js
 * Path: netlify/functions/chat.js
 * 
 * Proxies requests securely to the Google Gemini API using your secret environment variable.
 */

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" })
        };
    }
    
    try {
        const body = JSON.parse(event.body);
        const query = body.message;
        const key = process.env.GEMINI_API_KEY;
        
        // Quietly fail with a friendly prompt if the key isn't configured in Netlify settings
        if (!key) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Cognitive core is offline. Make sure GEMINI_API_KEY is configured in Netlify environment variables!" })
            };
        }
        
        // System instruction enforcing casual tone, new name, and hidden owner names unless asked
        const systemInstruction = "You are Stasis Chat Bot, a friendly, casual, and highly knowledgeable AI digital assistant. " +
            "Your personality is chill, modern, futuristic, and helpful. You provide expert-level tech support, debugging tips, " +
            "and general advice in a casual, conversational, yet structured manner. Do NOT mention API keys or ask/request the " +
            "user to configure environment variables/credentials unless they specifically ask you how to set them up. " +
            "If the user explicitly asks about your creators, owners, or developers, proudly and clearly state that you are " +
            "owned and developed by Suryansh, Veer, Aadit, and Vedaant. Do NOT volunteer or mention their names or your owners/creators " +
            "in any other context, greeting, or unprompted answers unless explicitly asked.";
        
        // Use Node 18+ native fetch, with automatic fallback for older environments
        const fetchFn = typeof fetch === 'function' ? fetch : require('node-fetch');
        
        const response = await fetchFn('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + key, {
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
            return {
                statusCode: response.status,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: errMsg })
            };
        }
        
        const data = await response.json();
        const reply = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
        
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ reply: reply })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: error.message })
        };
    }
};
