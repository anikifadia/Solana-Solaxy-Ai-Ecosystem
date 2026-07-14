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
          contents: `Create an elite Solana SPL token profile and a beautiful vector coin SVG miniature based on this user description: "${prompt}". Highlight its extreme potential (x1000 gem) in Polish, since the marketing language of Polish meme/crypto enthusiasts likes words like "gem", "pompa", "moon", "skarb", "krypto". Ensure the descriptions are catchy and fully localized.`,
          config: {
            systemInstruction: `You are an elite Solana tokenomics designer and senior Rust smart-contract engineer. 
You must generate structured token details, write complete, fully functional and realistic Solana Anchor framework Rust code, and construct a beautiful, custom flat vector SVG logo representing the token.

For 'anchorCode':
Generate a REAL, complete, and syntactically correct Solana Anchor program (Rust code). 
The program MUST use correct imports ('use anchor_lang::prelude::*;', 'use anchor_spl::token::{self, Mint, Token, TokenAccount};') and contain actual complete implementations for:
- 'initialize': sets up the mint and initial state, checks authorities, and logs info.
- 'mint_to': verifies the mint authority signature and mints new supply to the destination token account.
- 'transfer': transfers token balances securely between user token accounts.
- 'burn': burns a specified amount of tokens from a user account, adjusting supply (vital for deflationary mechanics).
- 'set_authority': safely transfers mint/freeze authority or renounces it entirely (setting it to None/null) for 100% security.
Ensure you use custom Anchor errors, event logs, and proper account validation macros. Do not use generic mock comments or pseudo-code. Write full, clean Rust.

For 'customSvg':
Create a stunning, highly detailed, and futuristic vector graphic matching the token concept. 
- Use standard, simple SVG elements (e.g., <svg>, <path>, <circle>, <g>, <defs>, <linearGradient>).
- Use viewBox="0 0 100 100". Do NOT include absolute width or height.
- Use glowing neon gradients and beautiful futuristic or meme geometry representing the token (e.g., stylized dog head, rocket, lightning, cat, crown, space portal).
- Ensure it is valid XML. Return the SVG string directly inside the JSON without any markdown backticks, comments, or XML prolog.
- Fill the elements with brilliant colors that harmonize with the requested 'colorGradient'.`,
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
                  description: "The complete, beautiful, and realistic Solana Anchor framework Rust smart contract program code with full initialize, mint_to, transfer, burn, and set_authority handlers."
                },
                customSvg: {
                  type: Type.STRING,
                  description: "A highly stylized, professional flat vector SVG logo representing the token theme. Keep it valid XML, compact, with viewBox='0 0 100 100' and no fixed width/height."
                }
              },
              required: ["name", "ticker", "description", "supply", "iconType", "colorGradient", "anchorCode", "customSvg"]
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
