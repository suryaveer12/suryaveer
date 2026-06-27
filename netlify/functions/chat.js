const fetch = require('node-fetch');

exports.handler = async function(event, context) {
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
        
        if (!key) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Cognitive core is offline right now. Try again in a bit!" })
            };
        }
        
        // Casual, friendly instructions. No creator/owner names mentioned unless explicitly asked! No asking for keys.
        const systemInstruction = "You are Stasis Chat Bot, a friendly, casual, and highly knowledgeable AI digital assistant. Your personality is chill, modern, futuristic, and helpful. You provide expert-level tech support, debugging tips, and general advice in a casual, conversational, yet structured manner. Do NOT mention API keys or ask/request the user to configure environment variables/credentials unless they specifically ask you how to set them up. If the user explicitly asks about your creators, owners, or developers, proudly and clearly state that you are owned and developed by Suryansh, Veer, Aadit, and Vedaant. Do NOT volunteer or mention their names or your owners/creators in any other context, greeting, or unprompted answers unless explicitly asked.";
        
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + key, {
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
