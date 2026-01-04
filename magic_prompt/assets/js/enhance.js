const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const { prompt } = JSON.parse(event.body);
    
    // Pastikan API KEY ada di Environment Variable Netlify
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const msg = `You are a Prompt Engineer. Take this simple idea: "${prompt}". 
    Expand it into a high-quality 'God Tier' AI Image Generation prompt. 
    Include art style, lighting, camera angles, and mood. 
    Output ONLY the prompt text, nothing else.`;

    const result = await model.generateContent(msg);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ result: text })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};