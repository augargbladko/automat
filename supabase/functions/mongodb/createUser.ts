/*
  generate the telegramInitData
  second call to pass in the wallet
  third call does the email address
*/

import { getWalletAddress } from "../ton/tonWallet.ts";
import { delay } from "../utils/time.ts";
import { subscribeProfileToList } from "./klaviyo.ts";
import { createTelegramInitData } from "./telegramInitData.ts";
import { SupabaseUser } from "./user.ts";

const baseRoute = 'https://dig-it-gold.vercel.app';
const apiRoutes = {
  user: '/api/user', // { telegramInitData, referrerTelegramId, tonWalletAddress, timeZone }
  wallet: 'api/user/wallet', // { telegramInitData, tonWalletAddress }
  emailEntry: '/api/user/email/entry', // { telegramInitData, email }
  emailConfirm: '/api/user/email/confirm', // { email, telegramId } << email must be entered as requested // const authToken = req.headers.get('Authorization'); if (!authToken || authToken !== process.env.KLAYVIO_AUTHORIZATION) {
  purchaseTokens: '/api/verify-and-purchase-tokens', // { telegramInitData, packageId }
  tonPurchase: '/api/verify-ton-purchase', // { packageId, packageType, transactionHash }
}

export async function createUser(user: SupabaseUser) {
  (await newUserCreate(user))
    && (await newUserAddWallet(user))
    && (await newUserConfirmEmail(user));
}

async function newUserCreate(user: SupabaseUser): Promise<boolean> {
  const telegramInitData = createTelegramInitData(user);
  const userBody = {
    telegramInitData: telegramInitData,
    referrerTelegramId: user.referredById,
    timeZone: user.timeZone,
  }
  const createUserResponse = await fetch(baseRoute + apiRoutes.user, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userBody),
  });
  const createUserData = await createUserResponse.json();
  console.log("Create user response:", createUserData);
  await delay(1000);
  return createUserResponse.ok;
}

async function newUserAddWallet(user: SupabaseUser): Promise<boolean> {
  const telegramInitData = createTelegramInitData(user);
  const walletRequest = {
    telegramInitData: telegramInitData,
    tonWalletAddress: getWalletAddress(user.id),
  }
  const addWalletResponse = await fetch(baseRoute + apiRoutes.wallet, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(walletRequest),
  });
  const addWalletData = await addWalletResponse.json();
  console.log("Add wallet response:", addWalletData);
  await delay(1000);
  return addWalletResponse.ok;
}

async function newUserConfirmEmail(user: SupabaseUser): Promise<boolean> {
  const telegramInitData = createTelegramInitData(user);

  // add email call
  const addEmailRequest = {
    telegramInitData: telegramInitData,
    email: user.email,
  }
  const addEmailResponse = await fetch(baseRoute + apiRoutes.emailEntry, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(addEmailRequest),
  });
  const addEmailData = await addEmailResponse.json();
  console.log("Add email response:", addEmailData);

  if(!addEmailResponse.ok) {
    return false;
  } else if (!user.confirmedEmail) {
    return true;
  }
  await delay(2000);

  // Klaviyo API call to confirm email
  if (!await subscribeProfileToList(user)) {
    return false;
  }
  await delay(2000);

  // api call to confirm email
  const confirmEmailRequest = {
    email: user.email,
    telegramId: user.telegramId,
  }
  const confirmEmailResponse = await fetch(baseRoute + apiRoutes.emailConfirm, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(confirmEmailRequest),
  });
  const confirmEmailData = await confirmEmailResponse.json();
  console.log("Confirm email response:", confirmEmailData);
  await delay(1000);
  return confirmEmailResponse.ok;
}