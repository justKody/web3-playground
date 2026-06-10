const {getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction} = require("@solana/spl-token")
const {PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction, Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL} = require("@solana/web3.js")


const connection = new Connection(clusterApiUrl("devnet"));

async function main () {

    const adminPayer = Keypair.fromSecretKey(Uint8Array.from([192,12,20,232,165,203,202,146,35,253,149,255,22,89,68,221,131,183,181,181,165,187,146,248,221,181,208,54,142,186,149,15,204,54,165,45,20,249,226,213,122,153,95,77,54,223,87,148,10,12,251,97,48,231,161,59,33,202,133,250,14,37,15,79]));
    const [pdaAddress] = PublicKey.findProgramAddressSync(
        [  
            // seed 1
            // seed 2
            // seed 3
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID, // associated program id address
    );

    // creating ata

    const tx = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: payer.publicKey() ,
            lamports: 0.5 * LAMPORTS_PER_SOL,
            newAccountPubkey: pdaAddress,
            programId: TOKEN_PROGRAM_ID,
            space: 256
        })
    )


    // notice pda address dont have an private key to sign, so we use some different methods
    const sign = sendAndConfirmTransaction(connection, tx, [adminPayer])

    console.log(address.toBase58())
    console.log(address2.toBase58())

}

async function main2() {
    const adminPayer = Keypair.fromSecretKey(
        Uint8Array.from([
            192, 12, 20, 232, 165, 203, 202, 146,
            35, 253, 149, 255, 22, 89, 68, 221,
            131, 183, 181, 181, 165, 187, 146, 248,
            221, 181, 208, 54, 142, 186, 149, 15,
            204, 54, 165, 45, 20, 249, 226, 213,
            122, 153, 95, 77, 54, 223, 87, 148,
            10, 12, 251, 97, 48, 231, 161, 59,
            33, 202, 133, 250, 14, 37, 15, 79
        ])
    );

    // The PDA that will OWN the ATA
    const [pdaAddress] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("vault"),
            adminPayer.publicKey.toBuffer(),
        ],
        new PublicKey("YOUR_PROGRAM_ID_HERE")
    );

    // USDC Mint (example)
    const mint = new PublicKey(
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    );

    // Derive the ATA address for the PDA owner
    const ataAddress = await getAssociatedTokenAddress(
        mint,
        pdaAddress,
        true // allowOwnerOffCurve because PDA is off-curve
    );

    const tx = new Transaction().add(
        createAssociatedTokenAccountInstruction(
            adminPayer.publicKey, // payer
            ataAddress,           // ATA address
            pdaAddress,           // owner of ATA (PDA)
            mint                  // token mint
        )
    );

    const signature = await sendAndConfirmTransaction(
        connection,
        tx,
        [adminPayer]
    );

    console.log("PDA:", pdaAddress.toBase58());
    console.log("ATA:", ataAddress.toBase58());
    console.log("Transaction:", signature);
}

main()