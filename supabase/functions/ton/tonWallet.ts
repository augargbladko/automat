/// <reference lib="deno.ns" />

import { mnemonicToPrivateKey } from "@ton/crypto"
import { WalletContractV4 } from "@ton/ton"

export async function getPublicKey(referralGroup: number | null) {
  return (
    await mnemonicToPrivateKey(
      (
        Deno.env.get(!referralGroup ? "TON_TEMP_MNEMONIC" : "TON_MNEMONIC") ||
        ""
      ).split(" ")
    )
  ).publicKey
}

export async function getSecretKey() {
  return (
    await mnemonicToPrivateKey((Deno.env.get("TON_MNEMONIC") || "").split(" "))
  ).secretKey
}

export async function getWallet(
  id: number,
  referralGroup: number
): Promise<WalletContractV4> {
  return WalletContractV4.create({
    workchain: 0,
    publicKey: await getPublicKey(referralGroup),
    walletId: id,
  })
}

export async function getWalletAddress(
  id: number | null,
  referralGroup: number | null
): Promise<string | null> {
  if (!id) {
    return null
  }
  const w = WalletContractV4.create({
    workchain: 0,
    publicKey: await getPublicKey(referralGroup),
    walletId: id,
  })
  const address = w.address.toString({ bounceable: false })
  console.log("created address for id:", id, address)
  return address
}
