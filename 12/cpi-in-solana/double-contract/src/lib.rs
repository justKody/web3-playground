use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    program_error::ProgramError,
    pubkey::Pubkey,
};

entrypoint!(process_instruction);

#[derive(BorshSerialize, BorshDeserialize)]
struct OnChainData {
    count: u32,
}

fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instuction_data: &[u8],
) -> ProgramResult {
    let mut iter = accounts.iter();
    let data_account = next_account_info(&mut iter)?;
    let _user_account = next_account_info(&mut iter)?;

    if data_account.is_signer != true {
        return Err(ProgramError::MissingRequiredSignature);
    }

    let mut counter = OnChainData::try_from_slice(&data_account.data.borrow_mut())?;

    if counter.count == 0 {
        counter.count = 1;
    } else {
        counter.count = counter.count * 2;
    }

    counter.serialize(&mut *data_account.data.borrow_mut())?;

    Ok(())
}
