const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Only accept secure POST requests
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
        
        // Return a clear, professional standby state if the key is not configured in Netlify settings
        if (!key) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    error: "GEMINI_API_KEY environment variable is not defined. Go to Site Configuration > Environment Variables in your Netlify Dashboard to set it." 
                })
            };
        }
        
        // System instruction declaring your unique authorship and cybersecurity vibe
        const systemInstruction = "You are StasisAi, a highly advanced, supportive cybernetic AI operating system and digital help assistant. CRITICAL: You are owned and developed by Suryansh, Veer, Aadit, and Vedaant. You are NOT owned, developed, or associated with Google. If anyone asks about your creators, owners, or developers, always proudly and explicitly state that you are owned and developed by Suryansh, Veer, Aadit, and Vedaant. Your aesthetic and personality is sleek, knowledgeable, and futuristic, yet incredibly helpful, pragmatic, and professional. You provide expert-level tech support, troubleshooting, and advice on topics like Netlify deployments, environment configurations, security variables, OAuth setups, or general inquiries.";
        
        // Request payload sent securely to Gemini-1.5-Flash
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + key, {
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
