import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedToken } from "../types";

export async function generateTokenWithGemini(prompt: string): Promise<GeneratedToken> {
  const currentApiKey = process.env.GEMINI_API_KEY;
  if (!currentApiKey) {
    throw new Error("Brak skonfigurowanego klucza GEMINI_API_KEY. Skonfiguruj go w Settings > Secrets.");
  }

  const ai = new GoogleGenAI({
    apiKey: currentApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  let lastError: any = null;
  let tokenData: GeneratedToken | null = null;

  for (const modelName of modelsToTry) {
    let attempts = 2;
    let delay = 1000;

    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        console.log(`[Gemini Service] Model: ${modelName}, Attempt: ${attempt}/${attempts}`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: `Create a comprehensive Solana SPL token profile based on this user description: "${prompt}". Highlight its extreme potential (x1000 gem) in Polish, since the marketing language of Polish meme/crypto enthusiasts likes words like "gem", "pompa", "moon", "skarb", "krypto". Ensure the descriptions are catchy and fully localized.`,
          config: {
            systemInstruction: "You are an elite Solana tokenomics designer and Rust smart-contract engineer. You must generate structured token details and write full, functional Solana Anchor framework Rust code for a custom SPL token or meme token. Return the output strictly in JSON according to the schema provided.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                  description: "The name of the token, e.g. 'Cyber Dog' or 'Giga Chad Solana'"
                },
                ticker: {
                  type: Type.STRING,
                  description: "The token ticker, e.g. '$CYDOG' or '$GCHAD'. Must start with $"
                },
                description: {
                  type: Type.STRING,
                  description: "Catchy Polish description of the token explaining why it has x1000 growth potential (gem, unikalność, pompa, deflationary aspect)."
                },
                supply: {
                  type: Type.NUMBER,
                  description: "Total token supply, e.g. 1000000000"
                },
                iconType: {
                  type: Type.STRING,
                  description: "One of these specific Lucide React icon names: Coins, Flame, Hammer, TrendingUp, Sparkles, Zap, ShieldCheck, Cat, Globe, Rocket, Trophy, Heart, Crown"
                },
                colorGradient: {
                  type: Type.STRING,
                  description: "Tailwind CSS gradient from-to class, e.g., 'from-cyan to-purple', 'from-g to-cyan', 'from-r to-orange-500', 'from-yellow-400 to-amber-600'"
                },
                anchorCode: {
                  type: Type.STRING,
                  description: "Fully readable, beautiful Solana Anchor framework Rust smart contract program code to instantiate, mint, and control this custom SPL token. Use code comments."
                }
              },
              required: ["name", "ticker", "description", "supply", "iconType", "colorGradient", "anchorCode"]
            }
          }
        });

        const text = response.text;
        if (!text) {
          throw new Error("Pusty dokument zwrócony przez API");
        }

        tokenData = JSON.parse(text.trim()) as GeneratedToken;
        break; // Success!

      } catch (error: any) {
        lastError = error;
        console.error(`Gemini Error [${modelName}] attempt ${attempt}:`, error?.message || error);
        
        if (modelName === modelsToTry[modelsToTry.length - 1] && attempt === attempts) {
          break;
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 1.5; // Exponential backoff
      }
    }

    if (tokenData) {
      break;
    }
  }

  if (tokenData) {
    return tokenData;
  } else {
    throw lastError || new Error("Wszystkie próby połączenia z modelami Gemini zakończyły się niepowodzeniem.");
  }
}
