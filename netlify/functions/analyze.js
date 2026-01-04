const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const { image } = JSON.parse(event.body); 
    // Image dikirim dari frontend dalam format base64 (data:image/jpeg;base64,...)

    // Bersihkan header base64 agar hanya sisa datanya
    const base64Data = image.split(',')[1];
    const mimeType = image.split(';')[0].split(':')[1];

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Analyze this image in detail. Describe the subject, art style, lighting, composition, and mood. Create a text prompt that could be used to recreate this exact image using AI generator. Provide ONLY the prompt.";

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
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