import { delay } from "../utils/index.ts";


export async function getLastTonTransaction(fromWallet: string): Promise<string> {
  let txHash = "";
  try {
    const result = await fetch(`https://tonapi.io/v2/accounts/${fromWallet}/events?limit=1`)
    const response = await result.json();
    console.log("Ton transaction events response:", response);
    txHash = response?.events?.length >= 1 ? response?.events?.[0]?.event_id || "" : "";
  } catch (e) {
    console.error('Error fetching last ton transaction:', e);
  }
  await delay(1100);
  return txHash;
}

export async function waitForTonTransaction(txType: string, fromAddress: string, lastHash: string) {
  let newHash = await getLastTonTransaction(fromAddress);
  let tries = 0;
  while (newHash === lastHash && tries < 10) {
    tries++;
    console.log(`Waiting for transaction to complete... ${tries} tries`);
    newHash = await getLastTonTransaction(fromAddress);
  }
  console.log(`${txType} complete. Transaction hash: ${newHash}`);
  return;
}