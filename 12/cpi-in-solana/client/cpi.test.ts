import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { test, expect } from "bun:test";
import { LiteSVM } from "litesvm";
import { Buffer } from "buffer";

test("Using CPI", async () => {
  const svm = new LiteSVM();

  const cpiContractKey = PublicKey.unique();
  const doubleContractKey = PublicKey.unique();

  svm.addProgramFromFile(doubleContractKey, "./double.so");
  svm.addProgramFromFile(cpiContractKey, "./proxy.so");

  const userAcc = Keypair.generate();
  const dataAcc = Keypair.generate();

  svm.airdrop(userAcc.publicKey, BigInt(LAMPORTS_PER_SOL));

  createDataAccount(svm, userAcc, dataAcc, doubleContractKey);

  const balanceAfter = svm.getBalance(dataAcc.publicKey);
  expect(balanceAfter).toBe(svm.minimumBalanceForRentExemption(BigInt(4)));

  function double() {
    const blockhash = svm.latestBlockhash();

    const ix = new TransactionInstruction({
        programId: cpiContractKey,
        keys: [
            {pubkey: dataAcc.publicKey, isSigner: true, isWritable: true},
            {pubkey: doubleContractKey, isSigner: false, isWritable: false},
            {pubkey: userAcc.publicKey, isSigner: false, isWritable: true}
        ]
    })

    const tx = new Transaction();
    tx.recentBlockhash = blockhash;
    tx.feePayer = userAcc.publicKey;
    tx.add(ix);
    tx.sign(userAcc, dataAcc);

    const res = svm.sendTransaction(tx);
    console.log(res.toString())
    svm.expireBlockhash();
  }

  double()
  double()
  double()
  double()

  const data = svm.getAccount(dataAcc.publicKey)?.data!
  expect(data.subarray(0,4)).toEqual(Buffer.from([8, 0, 0, 0]))

});

function createDataAccount(
  svm: LiteSVM,
  userAcc: Keypair,
  dataAcc: Keypair,
  programId: PublicKey,
) {
  const blockhash = svm.latestBlockhash();

  const ix = SystemProgram.createAccount({
    fromPubkey: userAcc.publicKey,
    lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4))),
    newAccountPubkey: dataAcc.publicKey,
    programId,
    space: 4,
  });

  const tx = new Transaction();
  tx.recentBlockhash = blockhash;
  tx.feePayer = userAcc.publicKey;
  tx.add(ix);
  tx.sign(userAcc, dataAcc);

  svm.sendTransaction(tx);
  svm.expireBlockhash();
}
