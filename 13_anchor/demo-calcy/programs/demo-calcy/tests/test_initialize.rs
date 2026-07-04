use {
    anchor_lang::{
        solana_program::instruction::{AccountMeta, Instruction},
        AnchorDeserialize,
    },
    litesvm::LiteSVM,
    solana_keypair::Keypair,
    solana_message::{Message, VersionedMessage},
    solana_signer::Signer,
    solana_transaction::versioned::VersionedTransaction,
};

// First 8 bytes of sha256("global:init") — Anchor's discriminator for the
// `init` instruction. Hardcoded because Anchor v1 does not expose a public
// `discriminator!` macro or the generated instruction builder structs.
const INIT_IX_DISCRIMINATOR: [u8; 8] = [0xdc, 0x3b, 0xcf, 0xec, 0x6c, 0xfa, 0x2f, 0x64];

#[test]
fn test_initialize() {
    let program_id = demo_calcy::id();
    let payer = Keypair::new();
    let account_keypair = Keypair::new();
    let mut svm = LiteSVM::new();

    let bytes = include_bytes!("../../../target/deploy/demo_calcy.so");
    svm.add_program(program_id, bytes).unwrap();
    svm.airdrop(&payer.pubkey(), 1_000_000_000).unwrap();

    let init_value: u32 = 42;

    // Build the instruction by hand: 8-byte discriminator + borsh-serialized
    // args (a single u32 = 4 little-endian bytes). Account ordering must match
    // the field order of `Initialize` in programs/demo-calcy/src/lib.rs:
    //   account, system_program, signer.
    let mut data = INIT_IX_DISCRIMINATOR.to_vec();
    data.extend_from_slice(&init_value.to_le_bytes());

    let instruction = Instruction {
        program_id,
        accounts: vec![
            AccountMeta::new(account_keypair.pubkey(), true),
            AccountMeta::new_readonly(anchor_lang::system_program::ID, false),
            AccountMeta::new(payer.pubkey(), true),
        ],
        data,
    };

    let blockhash = svm.latest_blockhash();
    let msg = Message::new_with_blockhash(&[instruction], Some(&payer.pubkey()), &blockhash);
    let tx = VersionedTransaction::try_new(
        VersionedMessage::Legacy(msg),
        &[&payer, &account_keypair],
    )
    .unwrap();

    svm.send_transaction(tx).unwrap();

    // First 8 bytes of an Anchor account are the account discriminator; skip.
    let account = svm.get_account(&account_keypair.pubkey()).unwrap();
    let stored: u32 = AnchorDeserialize::try_from_slice(&account.data[8..]).unwrap();
    assert_eq!(stored, init_value);
}
