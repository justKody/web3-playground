import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { Keypair } from "@solana/web3.js";
import { assert } from "chai";
import { DemoCalcy } from "../target/types/demo_calcy";

describe("demo-calcy", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.DemoCalcy as Program<DemoCalcy>;

  // `init` has no PDA seeds, so the data account is a fresh keypair that
  // co-signs the transaction (matches the Rust test in test_initialize.rs).
  const dataAccount = Keypair.generate();
  const wallet = (program.provider as anchor.AnchorProvider).wallet;

  it("Is initialized!", async () => {
    const initValue = 42;
    const tx = await program.methods
      .init(initValue)
      .accounts({
        account: dataAccount.publicKey,
        signer: wallet.publicKey,
      })
      .signers([dataAccount])
      .rpc();

    console.log("init tx:", tx);

    const state = await program.account.dataShape.fetch(dataAccount.publicKey);
    assert.equal(state.num, initValue);
  });

  it("Doubles the value", async () => {
    await program.methods
      .double()
      .accounts({
        account: dataAccount.publicKey,
        signer: wallet.publicKey,
      })
      .rpc();

    const state = await program.account.dataShape.fetch(dataAccount.publicKey);
    assert.equal(state.num, 84);
  });

  it("Adds a value", async () => {
    await program.methods
      .add(10)
      .accounts({
        account: dataAccount.publicKey,
        signer: wallet.publicKey,
      })
      .rpc();

    const state = await program.account.dataShape.fetch(dataAccount.publicKey);
    assert.equal(state.num, 94);
  });

  it("Subtracts a value", async () => {
    await program.methods
      .sub(4)
      .accounts({
        account: dataAccount.publicKey,
        signer: wallet.publicKey,
      })
      .rpc();

    const state = await program.account.dataShape.fetch(dataAccount.publicKey);
    assert.equal(state.num, 90);
  });
});
