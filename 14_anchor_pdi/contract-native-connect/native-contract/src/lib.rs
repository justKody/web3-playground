use std::vec;

use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{AccountInfo, next_account_info}, entrypoint::{self, ProgramResult}, instruction::{AccountMeta, Instruction}, program::invoke, program_error::ProgramError, pubkey::Pubkey,
};


#[derive(BorshSerialize, BorshDeserialize)]
enum InstructionData {
    Initialize,
    Double,
    Half,
}

entrypoint!(process_instruction);
fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = InstructionData::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    match instruction {
        InstructionData::Initialize => {
            let mut iter = accounts.iter();

            let data_account = next_account_info(&mut iter)?;
            let payer = next_account_info(&mut iter)?;
            let system_program = next_account_info(&mut iter)?;

            if !payer.is_signer {
                return Err((ProgramError::MissingRequiredSignature));
            }

            let instruction_descrimnator: u32 = 2; // calling create account
            // amount, space, owner
            // creating data_instruction
            let data_instruction = Vec::with_capacity(4 + 8 + 8 + 32); 

            
            let ix = Instruction {
              program_id: *system_program.key,
              accounts: vec![
                AccountMeta {
                    pubkey: *data_account.key,
                    is_signer: true,
                    is_writable: true   
                },
                AccountMeta {
                    pubkey: *payer.key,
                    is_signer: true,
                    is_writable: true
                },
              ],
              data: vec![]  
            };

            // invoke()
        }

        InstructionData::Double => {}
        InstructionData::Half => {}
    }

    Ok(())
}
