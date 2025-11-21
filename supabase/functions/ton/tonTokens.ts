import { internal, OpenedContract, TonClient, WalletContractV4 } from "@ton/ton";
import { delay } from "../utils/index.ts";
import { getLastTonTransaction, waitForTonTransaction } from "./helpers.ts";
import { getSecretKey, getWallet } from "./tonWallet.ts";

export async function getTonBalance(contract: OpenedContract<WalletContractV4>): Promise<bigint> {
  const balance = await contract.getBalance();
  await delay(1100);
  return balance;
}

export async function transferTon(fromId: number, toAddress: string, amountTon: number) {
  const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
  });
  const fromWallet = await getWallet(fromId);
  const fromAddress = fromWallet.address.toString({ bounceable: false });
  const contract = client.open(fromWallet);
  const seqno: number = await contract.getSeqno();
  const transfer = contract.createTransfer({
    seqno,
    secretKey: await getSecretKey(),
    messages: [internal({
      value: amountTon.toString(),
      to: toAddress,
      body: 'Transfer Ton',
    })]
  });
  console.log(`Transferring ${amountTon} TON from ${fromAddress} to ${toAddress}`);


  const lastHash = await getLastTonTransaction(fromAddress);

  await contract.send(transfer);

  await waitForTonTransaction('TON Transfer', fromAddress, lastHash);
}