import { Keypair, Transaction, SystemProgram, sendAndConfirmTransaction, LAMPORTS_PER_SOL, Connection } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com", "finalized");

async function crateAccount() {
    const payer = Keypair.fromSecretKey(new Uint8Array([34,210,232,198,138,84,216,34,5,100,61,245,172,70,89,57,225,91,18,253,33,168,80,129,147,21,133,198,94,94,228,10,123,171,170,49,116,51,2,54,12,216,137,31,223,103,212,224,1,97,203,202,228,0,239,189,178,68,82,164,11,110,41,73]));
    // First create and fund a new account with no space
    const newAccount = Keypair.generate();
    console.log(payer.publicKey.toBase58())
    const fundTx = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: newAccount.publicKey,
        lamports: 0.1 * LAMPORTS_PER_SOL,
        space: 0,
        programId: SystemProgram.programId,
      })
    );
    await sendAndConfirmTransaction(connection, fundTx, [payer, newAccount]);
    console.log("Funded account:", newAccount.publicKey.toBase58());
}

crateAccount();