use anchor_lang::prelude::*;

declare_id!("9NFr43uyu95tZYS7g8MFy3hVB1Z7d3EGobvy1Hd3mst7");

#[program]
pub mod cpi_contract {
    use anchor_lang::{solana_program::{instruction::Instruction, program::invoke}, system_program::{Transfer, transfer}};

    use super::*;

    pub fn sol_transfer(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
        let from_pubKey = ctx.accounts.sender.to_account_info();
        let to_pubKey = ctx.accounts.recipient.to_account_info();
        let program_id = ctx.accounts.system_program.key();

        let cpi_context = CpiContext::new(
            program_id,
            Transfer {
                from: from_pubKey,
                to: to_pubKey,
            },
        );

        transfer(cpi_context, amount)?;

        Ok(())
    }

    pub fn generic_cpi(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
        let from_pubKey = ctx.accounts.sender.to_account_info();
        let to_pubKey = ctx.accounts.recipient.to_account_info();
        let program_id = ctx.accounts.system_program.to_account_info();


        // Prepare instruction accountmeta data

        let account_metas = vec![
            AccountMeta::new(from_pubKey.key(), true),
            AccountMeta::new(to_pubKey.key(), false),
        ];

        // SOL transfer instruction
        let instruction_descrimnator: u32 = 2;

        // prepare instruction
        let mut instruction_data = Vec::with_capacity(4 + 8);
        instruction_data.extend_from_slice(&instruction_descrimnator.to_le_bytes());
        instruction_data.extend_from_slice(&amount.to_le_bytes());

        // create instruction

        let instruction = Instruction {
            program_id: program_id.key(),
            accounts: account_metas,
            data: instruction_data,
        };

        invoke(&instruction, &[from_pubKey, to_pubKey, program_id])?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SolTransfer<'info> {
    #[account(mut)]
    sender: Signer<'info>,
    #[account(mut)]
    recipient: SystemAccount<'info>,
    system_program: Program<'info, System>,
}
