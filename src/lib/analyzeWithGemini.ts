import { GoogleGenerativeAI } from "@google/generative-ai";
import { parameters } from "./parameters";

interface Feedback {
  scores: Record<string, number>;
  overallFeedback: string;
  observation: string;
}

export async function analyzeWithGemini(
  transcription: string
): Promise<Feedback> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are an expert call quality analyst.

Analyze the following call transcription and return a JSON object in this exact format:
{
  "scores": {
    "<parameter_key>": <numeric_score_based_on_rules>,
    ...
  },
  "overallFeedback": "Concise overall assessment of the agent's performance",
  "observation": "Specific behavioral observations and suggestions"
}

Evaluation parameters and rules:
${JSON.stringify(parameters, null, 2)}

Scoring rules:
- For parameters with "inputType": "PASS_FAIL" → Score must be either 0 or equal to the "weight".
- For parameters with "inputType": "SCORE" → Score can be any number between 0 and the "weight".
- Consider both the content and tone of the call.
- Mention key missed areas (if any) in the observation.

Now analyze this transcription:
"${transcription}"

Return ONLY valid JSON (no markdown, no code blocks, no explanations).
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().trim();

  try {
    let cleanedText = text;
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    console.log("Gemini raw output:", cleanedText);
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("JSON parsing failed. Returning fallback structure.", error);
    return {
      scores: Object.fromEntries(parameters.map((p) => [p.key, 0])),
      overallFeedback: "Unable to parse structured response from model.",
      observation: text,
    };
  }
}
