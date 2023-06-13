import * as anchor from "@project-serum/anchor";
import { Flip } from "artifacts/flip";

export const createFlip = async (
  program: anchor.Program<Flip>,
  creator: anchor.web3.PublicKey,
  value: number
): Promise<anchor.web3.Transaction> => {
  const vaultAccount = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault_account"), creator.toBuffer()],
    program.programId
  )[0];

  let tx = await program.methods
    .createFlip(new anchor.BN(value * anchor.web3.LAMPORTS_PER_SOL))
    .accounts({
      vaultAccount: vaultAccount,
      creator: creator,
    })
    .transaction();

  return tx;
};

export const flip = async (
  program: anchor.Program<Flip>,
  creator: anchor.web3.PublicKey,
  player: anchor.web3.PublicKey,
  value: number
): Promise<anchor.web3.Transaction> => {
  const vaultAccount = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault_account"), creator.toBuffer()],
    program.programId
  )[0];
  let tx = await program.methods
    .flip(new anchor.BN(value * anchor.web3.LAMPORTS_PER_SOL))
    .accounts({
      creator: creator,
      player: player,
      vaultAccount: vaultAccount,
    })
    .transaction();

  return tx;
};

export const getFlipOrder = async (
  program: anchor.Program<Flip>
): Promise<
  Array<{
    creator: string;
    value: number;
  }>
> => {
  const accounts = await program.provider.connection.getParsedProgramAccounts(
    program.programId, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    {
      filters: [
        {
          dataSize: 56, // number of bytes
        },
      ],
    }
  );

  const getAccountsDataPromises = accounts.map((item: any) =>
    program.account.vaultAccount.fetch(item.pubkey)
  );
  const vaultAccountsData = await Promise.all(getAccountsDataPromises);

  return vaultAccountsData.map((item) => {
    return {
      creator: item.creator.toString(),
      value: Number(item.value.toString()) / anchor.web3.LAMPORTS_PER_SOL,
    };
  });
};
