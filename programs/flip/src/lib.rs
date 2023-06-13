use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock;

declare_id!("9siGmhPYWd9iNuKe9HjcACwzBUDUtbq3u5hWfcCuvwH8");

#[program]
pub mod flip {
    use super::*;
    pub fn create_flip(ctx: Context<CreateFlip>, amount: u64) -> Result<()> {
        let transfer_sol_instruction = anchor_lang::system_program::Transfer {
            from: ctx.accounts.creator.to_account_info(),
            to: ctx.accounts.vault_account.to_account_info(),
        };
        let cpi_ctx_sol = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_sol_instruction
        );
        anchor_lang::system_program::transfer(cpi_ctx_sol, amount)?;
        let vault_account = &mut ctx.accounts.vault_account;
        vault_account.creator = ctx.accounts.creator.key();
        vault_account.value = amount;
        vault_account.flipped = false;
        msg!("Successful create a flip");
        Ok(())
    }

    pub fn flip(ctx: Context<Flip>, amount: u64) -> Result<()> {
        let transfer_sol_instruction = anchor_lang::system_program::Transfer {
            from: ctx.accounts.player.to_account_info(),
            to: ctx.accounts.vault_account.to_account_info(),
        };
        let cpi_ctx_sol = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_sol_instruction
        );
        anchor_lang::system_program::transfer(cpi_ctx_sol, amount)?;

        // get winner
        let unix_timestamp = clock::Clock::get().unwrap().unix_timestamp;

        if unix_timestamp % 2 == 0 {
            msg!("creator win !");
            **ctx.accounts.vault_account.to_account_info().try_borrow_mut_lamports()? -= amount * 2;
            **ctx.accounts.creator.try_borrow_mut_lamports()? += amount * 2;
        } else {
            msg!("player win !");
            **ctx.accounts.vault_account.to_account_info().try_borrow_mut_lamports()? -= amount * 2;
            **ctx.accounts.player.try_borrow_mut_lamports()? += amount * 2;
        }

        let vault_account = &mut ctx.accounts.vault_account;
        vault_account.value = 0;
        vault_account.flipped = true;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct CreateFlip<'info> {
    #[account(
        init_if_needed,
        payer = creator,
        seeds = [b"vault_account", creator.key().as_ref()],
        bump,
        space = 8 + 8 + 1 + 32
    )]
    pub vault_account: Account<'info, VaultAccount>,
    #[account(mut, constraint = creator.lamports() > amount)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct Flip<'info> {
    #[account(
        mut,
        seeds = [b"vault_account", creator.key().as_ref()],
        bump,
    )]
    pub vault_account: Account<'info, VaultAccount>,
    /// CHECK: check vault account
    pub creator: AccountInfo<'info>,
    #[account(mut, constraint = player.lamports() > amount)]
    player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct VaultAccount {
    pub creator: Pubkey,
    pub value: u64,
    pub flipped: bool,
}
