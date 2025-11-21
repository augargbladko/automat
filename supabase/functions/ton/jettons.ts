import { Address, beginCell, internal, SendMode, TonClient } from '@ton/ton';
 
import { TonApiClient } from '@ton-api/client';
import { delay } from "../utils/time.ts";
import { getLastTonTransaction, waitForTonTransaction } from "./helpers.ts";
import { getTonBalance } from "./tonTokens.ts";
import { getSecretKey, getWallet } from "./tonWallet.ts";


export async function getJettonBalance(walletAddress: string, jettonAddress: string): Promise<bigint> {
  let balance = 0n;
  try {
    const result = await fetch(`https://tonapi.io/v2/accounts/${walletAddress}/jettons/${jettonAddress}`)
    const response = await result.json();
    balance = BigInt(response?.balance || 0n)
  } catch (e) {
    console.error('Error fetching jetton balance:', e);
  }
  await delay(1100);
  return balance;
}
 

async function getJettonWalletAddress(fromWallet: string, jettonAddress: string): Promise<Address> {
  const jettonMaster: Address = Address.parse(jettonAddress)
  // Initialize TonApi client
  const ta = new TonApiClient({
    baseUrl: 'https://tonapi.io',
    apiKey: 'YOUR_API_KEY', // Optional, improves request limits and access
  });
 
  // Get the sender's jetton wallet address from the jetton master contract
  const jettonWalletAddressResult = await ta.blockchain.execGetMethodForBlockchainAccount(
    jettonMaster,
    'get_wallet_address',
    { args: [fromWallet] }
  );
  console.log("Jetton wallet address result:", jettonWalletAddressResult);
  await delay(1100);
 
  return Address.parse(jettonWalletAddressResult.decoded.jetton_wallet_address); // Extract the jetton wallet address
}


export async function transferAllJettonsAndCloseWallet(fromId: number, toAddress: string, jettonAddress: string) {
  const fromWallet = await getWallet(fromId);
  const fromAddress = fromWallet.address.toString({ bounceable: false });

  const contract = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
  }).open(fromWallet);


  const tonBalance: bigint = await getTonBalance(contract);
  console.log("Wallet:", tonBalance.toString(), fromAddress);
  if (tonBalance < 500n) {
    console.error("Not enough TON to cover fees");
    return;
  }

  const jettonBalance = await getJettonBalance(fromAddress, jettonAddress);
  if(jettonBalance === 0n) {
    console.log("No jetton balance to transfer");
    return;
  }

  const jettonWallet = await getJettonWalletAddress(fromAddress, jettonAddress);
 
  // Create payload for the jetton transfer
  const jettonTransferPayload = beginCell()
    .storeUint(0xf8a7ea5, 32) // JETTON_TRANSFER_OP_CODE (operation identifier)
    .storeUint(0, 64) // Query ID (0 for new transactions)
    .storeCoins(jettonBalance) // Amount to transfer (1 USDt)
    .storeAddress(Address.parse(toAddress)) // Recipient address
    .storeAddress(Address.parse(toAddress)) // Address to receive excess funds (usually address of sender) (we're sending all funds here)
    .storeBit(false) // No custom payload
    .storeCoins(1n) // Forward fee in nanoTON (for send notify to wallet)
    .storeMaybeRef(undefined)
    .endCell();
 
  // Get the current seqno (sequence number) for the wallet transaction
  const seqno = await contract.getSeqno(); // Can do this without a delay because the next call is a tonapi call
 
  const lastHash = await getLastTonTransaction(fromAddress);

  // Send the transfer transaction
  await contract.sendTransfer({
    seqno, // Required to ensure transaction uniqueness
    secretKey: await getSecretKey(), // Sign the transaction with the private key
    sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS + SendMode.CARRY_ALL_REMAINING_BALANCE + SendMode.CARRY_ALL_REMAINING_INCOMING_VALUE + SendMode.DESTROY_ACCOUNT_IF_ZERO, // Specify send mode
    messages: [
      internal({
        to: jettonWallet, // Sending to the sender's jetton wallet
        value: tonBalance, // BASE_JETTON_SEND_AMOUNT, // Gas fee - we send all the balance to cover fees
        body: jettonTransferPayload // Jetton transfer payload
      })
    ]
  });
  // Standard API rate limit
  await delay(1100);

  await waitForTonTransaction('Jetton Transfer', fromAddress, lastHash);
}
