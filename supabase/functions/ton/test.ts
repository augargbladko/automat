import { mnemonicNew } from "@ton/crypto";
import { internal, TonClient, WalletContractV4 } from "@ton/ton";
import { subscribeProfileToList } from "../mongodb/klaviyo.ts";
import { createTelegramInitData, validateTelegramWebAppData } from "../mongodb/telegramInitData.ts";
import { SupabaseUser, UserStatus } from "../mongodb/types.ts";
import { getLastTonTransaction } from "./helpers.ts";
import { getJettonBalance, transferAllJettonsAndCloseWallet } from "./jettons.ts";
import { getTonBalance } from "./tonTokens.ts";
import { getSecretKey, getWallet } from "./tonWallet.ts";

// deno run --allow-all --env-file supabase/functions/ton/test.ts

const jettonAddress: string = 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs'; // USDt jetton master contract

const testJetton = "EQACLXDwit01stiqK9FvYiJo15luVzfD5zU8uwDSq6JXxbP8";
const testWallet = "UQC8gtRH_9FofdOmfCbxjtv9FYg7MP6e2xMlztHPwVVyXebk";

export async function TestTgInitData() {
  const supabaseUser: SupabaseUser = {
    telegram_id: 456,
    username: "testuser",
    first_name: "Test",
    is_premium: true,
    email: "email@email.email",
    confirmed_email: true,
    user_level: 3,
    spend: 26,
    spend_total: 1546,
    time_zone: "America/New_York",
    referred_by_id: 0,
    treasure: 2,
    wallet_id: 12,
    wallet_address: "",
    user_status: UserStatus.none,
    user_Error: "",
  }
  const initData = createTelegramInitData(supabaseUser);
  console.log("Telegram init data:", initData);
  
  await subscribeProfileToList(supabaseUser);

    const { validatedData, telegramUser, message } = validateTelegramWebAppData(initData);
    console.log("Telegram init data validation:", validatedData, telegramUser, message);
}

export async function TestSendStuff() {
  const hash = await getLastTonTransaction(testWallet);
  console.log("Last transaction hash:", hash);
  const balance = await getJettonBalance(jettonAddress, testJetton);
  console.log("Jetton balance:", balance.toString());
  await transferAllJettonsAndCloseWallet(0, testWallet, testJetton);
}

export async function TestTonStuff() {
  await TestSendStuff()
  // Generate new key
  const mnemonics = await mnemonicNew();
  console.log("New mnemonic:", mnemonics.join(" "));

  // Create wallet contracts
  const wallets: WalletContractV4[] = []
  for (let i = 0; i < 10; i++) { 
    wallets.push(await getWallet(i));
    console.log("Wallet address:", i, wallets[wallets.length - 1].address.toString({ bounceable: false }));
  }

  const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
  });
  const wallet = wallets[0];
  const contract = client.open(wallet);

  // Get balance
  const balance: bigint = await getTonBalance(contract);
  console.log("Wallet balance:", balance.toString());

  // Create a transfer
  const seqno: number = await contract.getSeqno();
  const transfer = contract.createTransfer({
    seqno,
    secretKey: await getSecretKey(),
    messages: [internal({
      value: '1.5',
      to: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N',
      body: 'Hello world',
    })]
  });
  console.log("Transfer created:", transfer);

  console.log("Transfer hash:", transfer.hash);
  await contract.send(transfer);
}

async function Test() {
  TestTgInitData();
  await TestTonStuff();
  await TestSendStuff();
  Deno.exit();
}

Test()