import { mnemonicToPrivateKey } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";

export async function getPublicKey() {
  return (await mnemonicToPrivateKey((Deno.env.get("TON_MNEMONIC") || "").split(" "))).publicKey;
}

export async function getSecretKey() {
  return (await mnemonicToPrivateKey((Deno.env.get("TON_MNEMONIC") || "").split(" "))).secretKey;
}

export async function getWallet(id: number): Promise<WalletContractV4> {
  return WalletContractV4.create({ workchain: 0, publicKey: (await getPublicKey()), walletId: id });
}

export async function getWalletAddress(id: number): Promise<string> {
  const w = WalletContractV4.create({ workchain: 0, publicKey: (await getPublicKey()), walletId: id });
  const address = w.address.toString({ bounceable: false });
  console.log('created address for id:', id, address);
  return address;
}

