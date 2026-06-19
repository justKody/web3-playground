import {
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionInstruction,
} from "@solana/web3.js";
import { LiteSVM } from "litesvm";
import { expect, test, mock } from "bun:test";
import { Buffer } from "buffer";

test("Creates a data account for my program accont", async () => {
    const svm = new LiteSVM();

    const contractPubkey = PublicKey.unique();
    svm.addProgramFromFile(contractPubkey, "./double.so");

    const payer = Keypair.generate();

    svm.airdrop(payer.publicKey, BigInt(LAMPORTS_PER_SOL));
    const dataAccount = Keypair.generate();

    const blockhash = svm.latestBlockhash();

    const ixs = [
        SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: dataAccount.publicKey,
            programId: contractPubkey,
            lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4))),
            space: 4,
        }),
    ];

    const tx = new Transaction();

    tx.recentBlockhash = blockhash;
    tx.add(...ixs);
    tx.feePayer = payer.publicKey; // test specific
    tx.sign(payer, dataAccount);

    svm.sendTransaction(tx);

    const balanceAfter = svm.getBalance(dataAccount.publicKey);
    expect(balanceAfter).toBe(svm.minimumBalanceForRentExemption(BigInt(4)));


    function doubleIt() {
        const ix2 = new TransactionInstruction({
            keys: [
                { pubkey: dataAccount.publicKey, isSigner: true, isWritable: true },
                { pubkey: payer.publicKey, isSigner: true, isWritable: true },
            ],
            programId: contractPubkey,
            data: Buffer.from(""),
        });

        const tx2 = new Transaction()
        const blockhash = svm.latestBlockhash();
        tx2.recentBlockhash = blockhash;
        tx2.feePayer = payer.publicKey; // test specific
        tx2.add(ix2);
        tx2.sign(payer, dataAccount);
        const response = svm.sendTransaction(tx2);
        console.log(response.toString())
        svm.expireBlockhash()
    }

    doubleIt()
    doubleIt()
    doubleIt()
    doubleIt()
    doubleIt()  
    doubleIt()
    
    const data =  svm.getAccount(dataAccount.publicKey)?.data!
    console.log(data)
    expect(data.subarray(0, 4)).toEqual(Buffer.from([32, 0, 0, 0]));

});
