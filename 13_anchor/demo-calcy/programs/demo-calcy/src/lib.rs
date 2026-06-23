use anchor_lang::prelude::*;


declare_id!("D8FRCANumDLDTTmj3AYCJtGZX1edfvtZ2369L61r8eWJ");

#[program]
pub mod demo_calcy {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::handler(ctx)
    }
}
