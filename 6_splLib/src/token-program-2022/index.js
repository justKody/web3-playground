const {
    ExtensionType,
    TYPE_SIZE,
    LENGTH_SIZE,
    TOKEN_2022_PROGRAM_ID,
    createInitializeMetadataPointerInstruction,
    createInitializeMintInstruction,
    getMintLen,
    getOrCreateAssociatedTokenAccount,
    mintTo,
} = require('@solana/spl-token');
const { createInitializeInstruction, pack } = require('@solana/spl-token-metadata');
const {
    Keypair,
    Connection,
    clusterApiUrl,
    PublicKey,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
} = require('@solana/web3.js');

const payer = Keypair.fromSecretKey(Uint8Array.from([192,12,20,232,165,203,202,146,35,253,149,255,22,89,68,221,131,183,181,181,165,187,146,248,221,181,208,54,142,186,149,15,204,54,165,45,20,249,226,213,122,153,95,77,54,223,87,148,10,12,251,97,48,231,161,59,33,202,133,250,14,37,15,79]));

const mintAuthority = payer;

const connection = new Connection(clusterApiUrl('devnet'));

const TOKEN_NAME = 'Spl Lib Token';
const TICKER = 'SPL2';
const TOKEN_URI = 'https://example.com/spl2.json';
const DECIMALS = 6;

async function createMintForToken2022(payer, mintAuthority, name, symbol, uri) {
    const mintKeypair = Keypair.generate();
    const { publicKey: mint } = mintKeypair;
    const { publicKey: authority } = mintAuthority;

    const metadata = { mint, name, symbol, uri, additionalMetadata: [] };
    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const mintLenWithMetadata = getMintLen(
        [ExtensionType.MetadataPointer, ExtensionType.TokenMetadata],
        { [ExtensionType.TokenMetadata]: metadataLen }
    );

    const lamports = await connection.getMinimumBalanceForRentExemption(mintLenWithMetadata);

    const instructions = [
        SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: mint,
            space: mintLen,
            lamports,
            programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMintInstruction(mint, DECIMALS, authority, null, TOKEN_2022_PROGRAM_ID),
        createInitializeMetadataPointerInstruction(mint, authority, mint, TOKEN_2022_PROGRAM_ID),
        createInitializeInstruction({
            programId: TOKEN_2022_PROGRAM_ID,
            metadata: mint,
            updateAuthority: authority,
            mint,
            mintAuthority: authority,
            name, symbol, uri,
        }),
    ];

    await sendAndConfirmTransaction(connection, new Transaction().add(...instructions), [payer, mintKeypair]);

    console.log('Token-2022 mint created at', mint.toBase58());
    console.log('Ticker:', symbol);
    return mint;
}
async function mintNewTokens(mint, to, amount) {
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        new PublicKey(to),
        false,
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID
    );

    console.log('Token account created at', tokenAccount.address.toBase58());
    await mintTo(
        connection,
        payer,
        mint,
        tokenAccount.address,
        payer,
        amount,
        [],
        undefined,
        TOKEN_2022_PROGRAM_ID
    );
    console.log('Minted', amount, 'tokens to', tokenAccount.address.toBase58());
}

async function main() {
    const mint = await createMintForToken2022(payer, mintAuthority, TOKEN_NAME, TICKER, TOKEN_URI);
    await mintNewTokens(mint, mintAuthority.publicKey, 100 * 10 ** DECIMALS);
}

main();
