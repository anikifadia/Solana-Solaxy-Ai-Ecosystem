import { Connection } from "@solana/web3.js";

export interface VerificationResult {
  verified: boolean;
  error?: string;
  solAmount?: number;
  sender?: string;
  timestamp?: number;
}

export async function verifySolanaTx(
  signature: string,
  expectedReceiver: string,
  expectedAmountSol?: number
): Promise<VerificationResult> {
  try {
    const rpcUrls = [
      "https://api.mainnet-beta.solana.com",
      "https://api.devnet.solana.com"
    ];
    
    let txInfo: any = null;
    let lastRpcError: any = null;

    for (const rpcUrl of rpcUrls) {
      try {
        const connection = new Connection(rpcUrl, "confirmed");
        txInfo = await connection.getParsedTransaction(signature, {
          maxSupportedTransactionVersion: 0
        });
        if (txInfo) break;
      } catch (e: any) {
        lastRpcError = e;
        console.warn(`RPC ${rpcUrl} check failed:`, e?.message || e);
      }
    }

    if (!txInfo) {
      return { 
        verified: false, 
        error: "Transakcja nie została jeszcze odnaleziona w sieci Solana (może potrwać kilka sekund)." + 
          (lastRpcError ? ` (Ostatni błąd RPC: ${lastRpcError.message})` : "")
      };
    }

    if (txInfo.meta?.err) {
      return { verified: false, error: "Ta transakcja zakończyła się błędem na blockchainie." };
    }

    const accountKeys = txInfo.transaction.message.accountKeys;
    let amountTransferredLamports = 0;
    let foundReceiver = false;

    // Access instructions
    const instructions = txInfo.transaction.message.instructions;
    instructions.forEach((instruction: any) => {
      if (instruction.program === "system" && instruction.parsed?.type === "transfer") {
        const info = instruction.parsed.info;
        if (info.destination === expectedReceiver) {
          foundReceiver = true;
          amountTransferredLamports += info.lamports;
        }
      }
    });

    if (txInfo.meta?.innerInstructions) {
      txInfo.meta.innerInstructions.forEach((inner: any) => {
        inner.instructions.forEach((instruction: any) => {
          if (instruction.parsed?.type === "transfer" && instruction.parsed?.info?.destination === expectedReceiver) {
            foundReceiver = true;
            amountTransferredLamports += instruction.parsed.info.lamports;
          }
        });
      });
    }

    if (!foundReceiver) {
      return { 
        verified: false, 
        error: `Transakcja nie zawiera transferu środków na adres przedsprzedaży (${expectedReceiver}).` 
      };
    }

    const solAmount = amountTransferredLamports / 1e9;
    
    if (expectedAmountSol && Math.abs(solAmount - expectedAmountSol) > 0.05) {
      return { 
        verified: false, 
        error: `Niezgodność kwoty: transakcja opiewa na ${solAmount} SOL, a oczekiwano ${expectedAmountSol} SOL.` 
      };
    }

    // Check if accountKeys is an array of public keys or objects
    const sender = typeof accountKeys[0] === 'string' 
      ? accountKeys[0] 
      : (accountKeys[0].pubkey ? accountKeys[0].pubkey.toString() : accountKeys[0].toString());

    return {
      verified: true,
      solAmount,
      sender,
      timestamp: txInfo.blockTime ? txInfo.blockTime * 1000 : Date.now()
    };

  } catch (e: any) {
    console.error("Error in verifySolanaTx service:", e);
    return { 
      verified: false, 
      error: "Wystąpił błąd podczas odpytywania sieci Solana RPC: " + e.message 
    };
  }
}
