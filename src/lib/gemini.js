import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateIdeas(content) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Given this idea: "${content}", suggest 3 related creative ideas. 
    Return as JSON array with format: ["idea1", "idea2", "idea3"]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating ideas:", error);
    return [
      "Enhanced " + content,
      "Alternative " + content,
      "Extended " + content,
    ];
  }
}

export async function generateEmbedding(text) {
  try {
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return Array(768)
      .fill(0)
      .map((_, i) => Math.sin(text.charCodeAt(i % text.length) * (i + 1)));
  }
}

export async function clusterCards(cards) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const cardsList = cards.map((c) => `"${c.content}"`).join(", ");
    const prompt = `Group these ideas into logical clusters: [${cardsList}].
    Return as JSON object with format: 
    {
      "clusters": [
        {"name": "cluster_name", "cardIds": ["id1", "id2"], "color": "#hex_color"},
        ...
      ]
    }
    Use these card IDs: ${cards.map((c) => c._id).join(", ")}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error clustering cards:", error);
    return { clusters: [] };
  }
}

export async function summarizeBoard(cards) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const cardsList = cards.map((c) => c.content).join("\n- ");
    const prompt = `Summarize these brainstorming ideas:
    ${cardsList}
    
    Provide:
    1. Key themes (3-5 bullet points)
    2. Top 3 ideas
    3. Suggested next steps (3-5 actionable items)
    
    Return as JSON with format:
    {
      "themes": ["theme1", "theme2"],
      "topIdeas": ["idea1", "idea2", "idea3"],
      "nextSteps": ["step1", "step2"]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error summarizing board:", error);
    return {
      themes: ["Unable to generate themes"],
      topIdeas: ["Unable to identify top ideas"],
      nextSteps: ["Try adding more cards"],
    };
  }
}

export async function analyzeMood(content) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze the mood/sentiment of this text: "${content}".
    Return only one word: "positive", "neutral", or "negative"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const mood = response.text().toLowerCase().trim();

    if (["positive", "neutral", "negative"].includes(mood)) {
      return mood;
    }
    return "neutral";
  } catch (error) {
    console.error("Error analyzing mood:", error);
    return "neutral";
  }
}
