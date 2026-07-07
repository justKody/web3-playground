import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { CpiContract } from "../target/types/cpi_contract";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { assert } from "chai";

describe("cpi-contract", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const program = anchor.workspace.cpiContract as Program<CpiContract>;

  

  it("Is initialized!", async () => {
    const sender =  Keypair.generate()
    const recipient = PublicKey.unique()
    
    const signature = await provider.connection.requestAirdrop(
      sender.publicKey,
      2 * LAMPORTS_PER_SOL
    )

    await provider.connection.confirmTransaction(signature)
    const balance = await provider.connection.getBalance(sender.publicKey);

    console.log(balance / LAMPORTS_PER_SOL, "\n\n\n\n"); // 2
    assert.equal(2, balance / LAMPORTS_PER_SOL)


    const tx = await program.methods.genericCpi(new anchor.BN(1 * LAMPORTS_PER_SOL)).accounts({
      sender: sender.publicKey,
      recipient: recipient
    }).signers([sender]).rpc();
    
    console.log("Your transaction signature", tx);

    const account = await provider.connection.getAccountInfo(recipient)
    
    console.log("balance", account.lamports)
    assert.equal(account?.lamports, 1 * LAMPORTS_PER_SOL);
  });
});
