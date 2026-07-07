use std::vec;

use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint,
    entrypoint::ProgramResult,
    instruction::{AccountMeta, Instruction},
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    sysvar::Sysvar,
};

#[derive(BorshSerialize, BorshDeserialize)]
enum InstructionData {
    Initialize,
    Double,
    Half,
}

#[derive(BorshSerialize, BorshDeserialize)]
struct CounterState {
    count: u32,
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

            let instruction_descrimnator: u32 = 0; // calling create account
            //   4       4      32
            // amount, space, owner
            // creating data_instruction

            let space = 4;

            let rent = Rent::get()?;
            let lamport = rent.minimum_balance(space);

            let seeds = &[b"counter", payer.key.as_ref()];
            let (expected_pda, bump) = Pubkey::find_program_address(seeds, program_id);
            if data_account.key != &expected_pda {
                return Err(ProgramError::InvalidArgument);
            }

            let mut data = Vec::with_capacity(4 + 8 + 8 + 32);
            data.extend_from_slice(&instruction_descrimnator.to_le_bytes()); // enum /4
            data.extend_from_slice(&lamport.to_le_bytes()); // ammount /8
            data.extend_from_slice(&space.to_le_bytes()); // space /8
            data.extend_from_slice(program_id.as_ref()); // owner /32 

            let ix = Instruction {
                program_id: *system_program.key,
                accounts: vec![
                    AccountMeta::new(*payer.key, true),
                    AccountMeta::new(*data_account.key, false),
                ],
                data: data,
            };

            let signer_seed = &[b"counter", payer.key.as_ref(), &[bump]];

            invoke_signed(
                &ix,
                &[payer.clone(), data_account.clone(), system_program.clone()],
                &[signer_seed],
            )?;

            // &[
            //     &[
            //         &[],
            //         &[],
            //         &[],
            //     ]
            // ]

            // initialize the data account with value
            let counter_state = CounterState { count: 1 };
            counter_state.serialize(&mut *data_account.data.borrow_mut())?;
        }

        InstructionData::Double => {
            let mut iter = accounts.iter();

            let pda_account = next_account_info(&mut iter)?;
            let payer = next_account_info(&mut iter)?;

            if !payer.is_signer {
                return Err(ProgramError::MissingRequiredSignature);
            }

            // verify the pda

            let seeds = &[b"counter", payer.key.as_ref()];

            let (expected_pda, _) = Pubkey::find_program_address(seeds, program_id);

            if pda_account.key != &expected_pda {
                return Err(ProgramError::InvalidArgument);
            }

            let mut counter = CounterState::try_from_slice(&pda_account.data.borrow())?;

            counter.count *= 2;

            counter.serialize(&mut *pda_account.data.borrow_mut())?;
        }
        InstructionData::Half => {
            let mut iter = accounts.iter();

            let pda_account = next_account_info(&mut iter)?;
            let payer = next_account_info(&mut iter)?;

            if !payer.is_signer {
                return Err(ProgramError::MissingRequiredSignature);
            }

            // verify the pda

            let seeds = &[b"counter", payer.key.as_ref()];

            let (expected_pda, _) = Pubkey::find_program_address(seeds, program_id);

            if pda_account.key != &expected_pda {
                return Err(ProgramError::InvalidArgument);
            }

            let mut counter = CounterState::try_from_slice(&pda_account.data.borrow())?;

            counter.count /= 2;

            counter.serialize(&mut *pda_account.data.borrow_mut())?;
        }
    }

    Ok(())
}
