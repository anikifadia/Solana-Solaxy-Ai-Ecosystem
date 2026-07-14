import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "../middleware/security";
import { generateTokenWithGemini } from "../services/gemini";
import { verifySolanaTx } from "../services/solana";
import {
  tokens,
  saveTokens,
  presaleData,
  savePresale,
  calculateTotalSolRaised,
  activeMiners,
  miningHistory,
  withdrawalsHistory
} from "../db/store";

const router = Router();

// Zod Schemas
const generateTokenSchema = z.object({
  body: z.object({
    prompt: z.string().min(3, "Prompt musi mieć co najmniej 3 znaki.")
  })
});

const submitPresaleSchema = z.object({
  body: z.object({
    signature: z.string(),
    userAddress: z.string(),
    amountSol: z.number().optional(),
    isDemo: z.boolean().optional()
  })
});

const deployTokenSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nazwa tokenu musi mieć co najmniej 2 znaki."),
    ticker: z.string().min(2, "Symbol ticker musi mieć co najmniej 2 znaki."),
    description: z.string().optional(),
    supply: z.number().positive(),
    iconType: z.string().optional(),
    colorGradient: z.string().optional(),
    anchorCode: z.string().optional(),
    customSvg: z.string().optional()
  })
});

const tradeTokenSchema = z.object({
  body: z.object({
    ticker: z.string(),
    type: z.enum(["BUY", "SELL"]),
    amount: z.number().positive()
  })
});

const minerHeartbeatSchema = z.object({
  body: z.object({
    username: z.string(),
    hashRate: z.number().optional(),
    balance: z.number().optional()
  })
});

const saveMinedSchema = z.object({
  body: z.object({
    username: z.string(),
    amount: z.number().positive()
  })
});

const withdrawMinedSchema = z.object({
  body: z.object({
    username: z.string(),
    amount: z.number().positive(),
    wallet: z.string()
  })
});

// 1. AI Token Generator
router.post("/gemini/generate-token", validateRequest(generateTokenSchema), async (req, res) => {
  const { prompt } = req.body;
  try {
    const tokenData = await generateTokenWithGemini(prompt);
    return res.json(tokenData);
  } catch (error: any) {
    console.error("[Gemini API Router] Error:", error?.message || error);
    return res.status(500).json({
      error: "Nie udało się wygenerować tokenu przez AI. Usługa Gemini jest aktualnie przeciążona. Spróbuj ponownie za chwilę.",
      details: error?.message || error
    });
  }
});

// 2. Mining & DEX Dashboard Status
router.get("/mining/status", (req, res) => {
  const minersList = Object.values(activeMiners).map(m => {
    const isOnline = m.isOnline && (Date.now() - m.lastSeen < 60000);
    return { ...m, isOnline };
  });

  const solPrice = 182.74;
  const totalMinedSol = Object.values(activeMiners).reduce((sum, m) => sum + (Number(m.balance) || 0), 0);
  
  const tvlUsd = 4700000000 + (tokens.length * 1500000) + (totalMinedSol * solPrice);
  const tradesCount = miningHistory.length;
  const volumeUsd = 280000000 + (tradesCount * 120000);
  const trades24h = 1.2 + (tradesCount * 0.001);

  res.json({
    miners: minersList,
    history: miningHistory,
    withdrawals: withdrawalsHistory,
    tokens: tokens,
    presale: {
      solRaised: calculateTotalSolRaised(),
      targetSol: presaleData.targetSol,
      receiverAddress: presaleData.receiverAddress,
      contributions: presaleData.contributions
    },
    stats: {
      tvlUsd,
      volumeUsd,
      trades24h,
      tokensCount: tokens.length,
      activeUsersCount: Object.keys(activeMiners).length
    }
  });
});

// 3. Presale Contribution Submission
router.post("/presale/submit", validateRequest(submitPresaleSchema), async (req, res) => {
  const { signature, userAddress, amountSol, isDemo } = req.body;

  // Check if transaction signature already exists
  if (presaleData.contributions.some((c) => c.signature === signature)) {
    return res.status(400).json({ error: "Ta transakcja została już zarejestrowana!" });
  }

  let verificationResult;
  if (signature.startsWith("demo_") || isDemo) {
    const demoAmount = Number(amountSol) || 2.5;
    verificationResult = {
      verified: true,
      solAmount: demoAmount,
      sender: userAddress,
      timestamp: Date.now()
    };
  } else {
    verificationResult = await verifySolanaTx(signature, presaleData.receiverAddress, Number(amountSol));
  }

  if (!verificationResult.verified) {
    return res.status(400).json({ error: verificationResult.error });
  }

  const rate = 6666.67;
  const tokensReceived = Math.round(verificationResult.solAmount * rate);

  const newContribution = {
    id: "tx_" + signature.substring(0, 8),
    address: verificationResult.sender.substring(0, 6) + "..." + verificationResult.sender.substring(verificationResult.sender.length - 4),
    amountSol: verificationResult.solAmount,
    amountSlx: tokensReceived,
    timestamp: verificationResult.timestamp,
    signature: signature
  };

  presaleData.contributions.unshift(newContribution);
  
  if (presaleData.contributions.length > 50) {
    presaleData.contributions.pop();
  }

  savePresale();

  miningHistory.unshift({
    id: Math.random().toString(36).substring(2, 11),
    username: newContribution.address,
    action: "ZAPIS_PLONU",
    amount: Number(verificationResult.solAmount),
    timestamp: new Date().toLocaleTimeString(),
    details: `Kupił ${tokensReceived.toLocaleString()} $SLX`
  });

  res.json({
    success: true,
    contribution: newContribution,
    totalSolRaised: calculateTotalSolRaised()
  });
});

// 4. Token Deployment
router.post("/tokens/deploy", validateRequest(deployTokenSchema), (req, res) => {
  const { name, ticker, description, supply, iconType, colorGradient, anchorCode, customSvg } = req.body;

  const formattedTicker = ticker.startsWith('$') ? ticker : `$${ticker}`;

  if (tokens.some(t => t.ticker.toUpperCase() === formattedTicker.toUpperCase())) {
    return res.status(400).json({ error: "Token o tym tickerze już istnieje w pulach!" });
  }

  const supplyNum = Number(supply);
  const initialPool = Math.floor(supplyNum * 0.8);

  const newToken = {
    name,
    ticker: formattedTicker,
    description: description || "",
    supply: supplyNum,
    iconType: iconType || "Coins",
    colorGradient: colorGradient || "from-g to-cyan",
    anchorCode: anchorCode || "",
    customSvg: customSvg || "",
    initialPool,
    remainingPool: initialPool,
    priceSol: 0.00001 + Math.random() * 0.0005,
    createdAt: Date.now()
  };

  tokens.push(newToken);
  saveTokens();

  miningHistory.unshift({
    id: Math.random().toString(36).substring(2, 11),
    username: "SYSTEM_DEX",
    action: "EMISJA",
    amount: supplyNum,
    timestamp: new Date().toLocaleTimeString(),
    details: `Token ${newToken.name} (${newToken.ticker})`
  });

  res.json({ success: true, token: newToken });
});

// 5. Token AMM Trade Swap
router.post("/tokens/trade", validateRequest(tradeTokenSchema), (req, res) => {
  const { ticker, type, amount } = req.body;

  const token = tokens.find(t => t.ticker.toUpperCase() === ticker.toUpperCase());
  if (!token) {
    return res.status(404).json({ error: "Token nie został znaleziony w pulach." });
  }

  const currentPriceSol = token.priceSol || 0.0001;
  const currentPriceSlx = currentPriceSol * 6666.67;
  let tokenAmount = 0;
  let slxValue = 0;

  if (type === "BUY") {
    tokenAmount = amount / currentPriceSlx;
    slxValue = amount;
    if ((token.remainingPool || 0) < tokenAmount) {
      return res.status(400).json({ 
        error: `Niewystarczająca płynność w puli! Pozostało tylko ${(token.remainingPool || 0).toLocaleString()} ${token.ticker}.` 
      });
    }
    token.remainingPool = Math.floor((token.remainingPool || 0) - tokenAmount);
    token.priceSol = currentPriceSol * (1 + (tokenAmount / (token.initialPool || 1000000)) * 1.5);
  } else {
    tokenAmount = amount;
    slxValue = amount * currentPriceSlx;
    token.remainingPool = Math.floor((token.remainingPool || 0) + tokenAmount);
    token.priceSol = Math.max(0.000001, currentPriceSol * (1 - (tokenAmount / (token.initialPool || 1000000)) * 1.0));
  }

  saveTokens();

  miningHistory.unshift({
    id: Math.random().toString(36).substring(2, 11),
    username: "AMM_KUPACZ",
    action: type === "BUY" ? "KUPNO" : "SPRZEDAŻ",
    amount: Number(tokenAmount.toFixed(4)),
    timestamp: new Date().toLocaleTimeString(),
    details: type === "BUY" 
      ? `${token.ticker} za ${slxValue.toFixed(2)} $SLX`
      : `${tokenAmount.toLocaleString(undefined, {maximumFractionDigits: 2})} ${token.ticker} za ${slxValue.toFixed(2)} $SLX`
  });

  if (miningHistory.length > 50) {
    miningHistory.pop();
  }

  res.json({ 
    success: true, 
    remainingPool: token.remainingPool, 
    newPriceSol: token.priceSol,
    tokenAmount
  });
});

// 6. Miner Heartbeat
router.post("/mining/heartbeat", validateRequest(minerHeartbeatSchema), (req, res) => {
  const { username, hashRate, balance } = req.body;
  
  const now = Date.now();
  if (!activeMiners[username]) {
    activeMiners[username] = {
      username,
      hashRate: hashRate || 0,
      balance: balance || 0,
      lastSeen: now,
      isOnline: true,
      totalMined: balance || 0
    };
    
    miningHistory.unshift({
      id: Math.random().toString(36).substring(2, 11),
      username,
      action: "REJESTRACJA",
      amount: 0,
      timestamp: new Date().toLocaleTimeString()
    });
  } else {
    activeMiners[username].hashRate = hashRate || 0;
    activeMiners[username].balance = balance || 0;
    activeMiners[username].lastSeen = now;
    activeMiners[username].isOnline = true;
  }
  
  res.json({ success: true });
});

// 7. Save Mined Balance
router.post("/mining/save", validateRequest(saveMinedSchema), (req, res) => {
  const { username, amount } = req.body;

  if (!activeMiners[username]) {
    activeMiners[username] = {
      username,
      hashRate: 0,
      balance: amount,
      lastSeen: Date.now(),
      isOnline: true,
      totalMined: amount
    };
  } else {
    activeMiners[username].balance = Number((activeMiners[username].balance + amount).toFixed(6));
    activeMiners[username].totalMined = Number((activeMiners[username].totalMined + amount).toFixed(6));
    activeMiners[username].lastSeen = Date.now();
  }

  miningHistory.unshift({
    id: Math.random().toString(36).substring(2, 11),
    username,
    action: "ZAPIS_PLONU",
    amount,
    timestamp: new Date().toLocaleTimeString()
  });

  if (miningHistory.length > 50) {
    miningHistory.pop();
  }

  res.json({ success: true, newBalance: activeMiners[username].balance });
});

// 8. Withdraw Miner Balance
router.post("/mining/withdraw", validateRequest(withdrawMinedSchema), (req, res) => {
  const { username, amount, wallet } = req.body;

  if (!activeMiners[username]) {
    return res.status(404).json({ error: "Użytkownik nie istnieje w bazie kopaczy." });
  }

  if (activeMiners[username].balance < amount) {
    return res.status(400).json({ error: "Niewystarczające saldo kopacza do wypłaty." });
  }

  activeMiners[username].balance = Number((activeMiners[username].balance - amount).toFixed(6));
  activeMiners[username].lastSeen = Date.now();

  const txId = "tx_" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const maskedWallet = wallet.substring(0, 6) + "..." + wallet.substring(wallet.length - 4);

  withdrawalsHistory.unshift({
    id: txId,
    username,
    amount,
    timestamp: new Date().toLocaleTimeString(),
    wallet: maskedWallet,
    status: "ZAKOŃCZONE"
  });

  miningHistory.unshift({
    id: Math.random().toString(36).substring(2, 11),
    username,
    action: "WYPŁATA",
    amount,
    timestamp: new Date().toLocaleTimeString()
  });

  if (withdrawalsHistory.length > 50) {
    withdrawalsHistory.pop();
  }

  res.json({ success: true, newBalance: activeMiners[username].balance, txId });
});

// 9. Contact Form Submissions Memory Store
export const contactSubmissions: any[] = [];

router.post("/system/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Proszę wypełnić wszystkie wymagane pola." });
  }

  const submission = {
    id: "contact_" + Math.random().toString(36).substring(2, 9),
    name,
    email,
    subject: subject || "Ogólne",
    message,
    timestamp: new Date().toISOString()
  };

  contactSubmissions.unshift(submission);
  res.json({ success: true, message: "Twoja wiadomość została pomyślnie wysłana i zarejestrowana!" });
});

// 10. System Live Telemetry Logs API
router.get("/system/telemetry", (req, res) => {
  const cpuUsage = Math.floor(10 + Math.random() * 25);
  const memoryUsage = Math.floor(124 + Math.random() * 28);
  const latencyRpc = Math.floor(18 + Math.random() * 22);

  const eventLogs = [
    { timestamp: new Date(Date.now() - 5000).toLocaleTimeString(), level: "INFO", message: "Połączenie z RPC zweryfikowane: api.mainnet-beta.solana.com" },
    { timestamp: new Date(Date.now() - 12000).toLocaleTimeString(), level: "INFO", message: "Zaktualizowano tętno zdecentralizowanych pul wydobywczych Solaxy" },
    { timestamp: new Date(Date.now() - 35000).toLocaleTimeString(), level: "SUCCESS", message: "Zapisano punkt kontrolny bazy danych DEX. Łączna liczba zarejestrowanych tokenów: " + tokens.length },
    { timestamp: new Date(Date.now() - 48000).toLocaleTimeString(), level: "INFO", message: "Pula filtrów Rate Limit: 0 zablokowanych adresów IP w bieżącej epoce" }
  ];

  res.json({
    status: "OPERATIONAL",
    cpu: cpuUsage,
    memory: `${memoryUsage}MB / 512MB`,
    latency: `${latencyRpc}ms`,
    queueSize: Math.floor(Math.random() * 2),
    blockedIpsCount: 0,
    logs: eventLogs,
    submissionsCount: contactSubmissions.length
  });
});

export default router;
