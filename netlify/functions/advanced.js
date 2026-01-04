// netlify/functions/advanced.js
exports.handler = async function(event) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  
  try {
    const { subject, style, lighting } = JSON.parse(event.body);
    
    // Prompt cerdas untuk meracik prompt
    const systemPrompt = `You are an expert Prompt Engineer for Midjourney V6. 
    Combine the user's inputs into a single, highly detailed, professional image prompt.
    Ensure to include keywords for resolution (8k, unreal engine 5) and composition.`;
    
    const userPrompt = `Subject: ${subject}. Style: ${style}. Lighting: ${lighting}.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });
    
    const data = await response.json();
    return { statusCode: 200, body: JSON.stringify({ result: data.choices[0].message.content }) };
  } catch (e) { return { statusCode: 500, body: JSON.stringify({ error: e.message }) }; }
};