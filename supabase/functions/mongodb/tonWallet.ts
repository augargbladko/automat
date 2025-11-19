import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";
import { TonClient, WalletContractV4, internal } from "@ton/ton";

const MNEMONIC = Deno.env.get("TON_WALLET_MNEMONIC") || "";

// deno run --allow-all --env-file supabase/functions/mongodb/tonWallet.ts

export async function TestTonStuff() {
  console.log('test ton start');
  // Create Client
  const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
  });

  // Generate new key
  const mnemonics = await mnemonicNew();
  console.log("Generated mnemonics:", mnemonics);
  const keyPair = await mnemonicToPrivateKey(mnemonics);

  // Create wallet contract
  const workchain = 0; // Usually you need a workchain 0
  const wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
  const contract = client.open(wallet);

  // Get balance
  const balance: bigint = await contract.getBalance();
  console.log("Wallet balance:", balance.toString());

  // Create a transfer
  const seqno: number = await contract.getSeqno();
  const transfer = await contract.createTransfer({
    seqno,
    secretKey: keyPair.secretKey,
    messages: [internal({
      value: '1.5',
      to: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N',
      body: 'Hello world',
    })]
  });
  console.log("Transfer created:", transfer);
  Deno.exit();
}

TestTonStuff()