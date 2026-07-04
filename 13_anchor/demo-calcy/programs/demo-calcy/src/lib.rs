use anchor_lang::prelude::*;

declare_id!("D8FRCANumDLDTTmj3AYCJtGZX1edfvtZ2369L61r8eWJ");

#[program]
pub mod demo_calcy {
    use super::*;

    pub fn init(ctx: Context<Initialize>, init_value: u32) -> Result<()> {
        ctx.accounts.account.num = init_value;
        Ok(())
    }

    pub fn double(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.account.num *= 2;
        Ok(())
    }

    pub fn add(ctx: Context<Update>, value: u32) -> Result<()> {
        ctx.accounts.account.num += value;
        Ok(())
    }
    pub fn sub(ctx: Context<Update>, value: u32) -> Result<()> {
        ctx.accounts.account.num -= value;
        Ok(())
    }
}

#[derive(Accounts)] // pre-step that tells the instruction program what accounts it needs in the context
pub struct Initialize<'info> {
    #[account(init, payer=signer, space= 8 + 4)]
    pub account: Account<'info, DataShape>,
    pub system_program: Program<'info, System>,
    #[account(mut)]
    pub signer: Signer<'info>, // this account is paying the fees for account creation and so therefore his/her solana will reduce
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub account: Account<'info, DataShape>,
    pub signer: Signer<'info>,
}


#[account]
pub struct DataShape {
    pub num: u32,
}