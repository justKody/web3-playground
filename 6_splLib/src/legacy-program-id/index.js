const { createMint, getOrCreateAssociatedTokenAccount, mintTo } = require('@solana/spl-token');
const { Keypair, Connection, clusterApiUrl,  TOKEN_PROGRAM_ID, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');

const payer = Keypair.fromSecretKey(Uint8Array.from([192,12,20,232,165,203,202,146,35,253,149,255,22,89,68,221,131,183,181,181,165,187,146,248,221,181,208,54,142,186,149,15,204,54,165,45,20,249,226,213,122,153,95,77,54,223,87,148,10,12,251,97,48,231,161,59,33,202,133,250,14,37,15,79]));

const mintAthority = payer;

const connection = new Connection(clusterApiUrl('devnet'));

async function createMintForToken(payer, mintAuthority) {
    const mint = await createMint(
        connection,
        payer,
        mintAuthority,
        null,
        6,
        TOKEN_PROGRAM_ID
    );
    console.log('Mint created at', mint.toBase58());
    return mint;
}

async function mintNewTokens(mint, to, amount) { 
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        new PublicKey(to)
      );

      console.log('Token account created at', tokenAccount.address.toBase58());
      await mintTo(
        connection,
        payer,
        mint,
        tokenAccount.address,
        payer,
        amount
      )
      console.log('Minted', amount, 'tokens to', tokenAccount.address.toBase58());
}

async function main() {
    // const mint = await createMintForToken(payer, mintAthority.publicKey);
    const mint = new PublicKey('9XjcjmVomfZdM8memzsYWBEHaAbAJkNtvJNzmNHjef63');
    await mintNewTokens(mint, mintAthority.publicKey, 100 * LAMPORTS_PER_SOL);    
}

main();
