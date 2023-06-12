import * as anchor from "@project-serum/anchor";
import { Program, Wallet } from "@project-serum/anchor";
import { Flip } from "../target/types/flip";
import idl from "../target/idl/flip.json";

(async () => {
  const connection = new anchor.web3.Connection(
    "https://api-testnet.renec.foundation:8899/"
  );
  const programId = new anchor.web3.PublicKey(
    "7KyfuxbdFSzMpn9DF1atPsPEHTLbVPgGwW7vb54x7C9J"
  );

  const player1 = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(require("../.wallets/player1.json"))
  ) as anchor.web3.Keypair;

  const player2 = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(require("../.wallets/player2.json"))
  ) as anchor.web3.Keypair;

  const provider = new anchor.AnchorProvider(connection, new Wallet(player1), {
    commitment: "processed",
  });
  const program = new Program(
    idl as anchor.Idl,
    programId,
    provider
  ) as Program<Flip>;

  const vaultAccount = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault_account"), player1.publicKey.toBuffer()],
    programId
  )[0];

  console.log("vault account: ", vaultAccount.toString());

  const accounts = await connection.getParsedProgramAccounts(
    programId, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    {
      filters: [
        {
          dataSize: 56, // number of bytes
        },
      ],
    }
  );

  console.log(accounts);

  const data = await program.account.vaultAccount.fetch(accounts[0].pubkey);
  console.log({
    creator: data.creator.toString(),
    value: Number(data.value.toString()) / anchor.web3.LAMPORTS_PER_SOL,
  });

  // const createFlip = await program.methods
  //   .createFlip(new anchor.BN(anchor.web3.LAMPORTS_PER_SOL))
  //   .accounts({
  //     vaultAccount: vaultAccount,
  //     creator: player1.publicKey,
  //   })
  //   .signers([player1])
  //   .rpc();

  // console.log("create flip transaction: ", createFlip);

  // await new Promise(r => setTimeout(r, 5000));

  // const flip = await program.methods
  //   .flip(new anchor.BN(anchor.web3.LAMPORTS_PER_SOL))
  //   .accounts({
  //     creator: player1.publicKey,
  //     player: player2.publicKey,
  //     vaultAccount: vaultAccount,
  //   })
  //   .signers([player2])
  //   .rpc();
  // console.log("flip transaction: ", flip);
})();
