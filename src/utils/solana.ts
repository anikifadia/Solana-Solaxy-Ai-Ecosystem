import { Connection, PublicKey } from '@solana/web3.js';

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export const fetchRealSolBalance = async (address: string): Promise<{ sol: number, tokens: Record<string, number> } | null> => {
  if (!address) return null;
  try {
    let pubKey: PublicKey;
    try {
      pubKey = new PublicKey(address);
      if (!PublicKey.isOnCurve(pubKey.toBuffer())) {
         // It might be an off-curve PDA, but we'll accept it anyway.
      }
    } catch (e) {
      console.warn("Invalid Solana public key format, skipping real balance fetch:", address);
      return null;
    }

    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    
    // Fetch SOL balance
    const balance = await connection.getBalance(pubKey);
    const sol = balance / 1e9;
    
    // Fetch SPL token balances
    const tokens: Record<string, number> = {};
    try {
      const response = await connection.getParsedTokenAccountsByOwner(pubKey, {
        programId: TOKEN_PROGRAM_ID
      });
      
      for (const item of response.value) {
        const parsedInfo = item.account.data.parsed.info;
        const mint = parsedInfo.mint;
        const amount = parsedInfo.tokenAmount.uiAmount;
        
        if (amount > 0) {
          // Store by mint address - we map common ones if possible
          if (mint === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') tokens['USDC'] = amount;
          else if (mint === 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB') tokens['USDT'] = amount;
          else if (mint === 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263') tokens['BONK'] = amount;
          else if (mint === 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYtM29mGv2R') tokens['WIF'] = amount;
          else if (mint === 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN') tokens['JUP'] = amount;
          else tokens[mint.substring(0, 4)] = amount; // fallback alias
        }
      }
    } catch (tokenErr) {
      console.warn("Failed to fetch SPL tokens:", tokenErr);
    }

    return { sol, tokens };
  } catch (error) {
    console.error("Failed to fetch real SOL balance for", address, error);
    return null;
  }
};
