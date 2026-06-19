use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::account_info::{AccountInfo, next_account_info};
use solana_program::entrypoint::{ProgramResult, entrypoint};
use solana_program::pubkey::Pubkey;

entrypoint!(process_instruction);

#[derive(BorshSerialize, BorshDeserialize)]
struct Counter {
    count: u32,
}

#[derive(BorshSerialize, BorshDeserialize)]
enum InstructionData {
    Increase,
    Decrease,
}

pub fn process_instruction(
    _pubkey: &Pubkey,         // the public key of where the program is deployed
    accounts: &[AccountInfo], // Read from the counter account
    instruction_data: &[u8],  // increase, decrease [0], [1]
) -> ProgramResult {
    // check if the counter account has signed the txn
    let mut iter = accounts.iter();
    let counter_account = next_account_info(&mut iter)?;

    if !counter_account.is_signer {
        return Err(solana_program::program_error::ProgramError::MissingRequiredSignature);
    }

    // read the value / decrease the value based on whatever the user wants to do
    let mut counter = Counter::try_from_slice(&counter_account.data.borrow())?; // borrow because of ref cell
    let instruction_data = InstructionData::try_from_slice(&instruction_data)?;

    match instruction_data {
        InstructionData::Decrease => {
            counter.count = counter.count - 1;
        }
        InstructionData::Increase => {
            counter.count = counter.count + 1;
        }
    }

    // write the change back

    counter.serialize(&mut *counter_account.data.borrow_mut())?;

    Ok(())
}
