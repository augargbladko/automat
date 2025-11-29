/*
  generate the telegramInitData
  second call to pass in the wallet
  third call does the email address
*/

import { getWalletAddress } from "../ton/tonWallet.ts";
import { API_ROUTES, BASE_ROUTE } from "../utils/consts.ts";
import { delay } from "../utils/time.ts";
import { createTelegramInitData } from "./data/telegramInitData.ts";
import { SupabaseUser } from "./data/types.ts";
import { subscribeProfileToList } from "./klaviyo.ts";

// TODO - call this, then call some gameplay and some GA if it's a temp user.
export async function createUser(user: SupabaseUser) {
  (await newUserCreate(user))
    && (await newUserAddWallet(user))
    && (await newUserConfirmEmail(user));
}

export async function newUserCreate(user: SupabaseUser): Promise<boolean> {
  const telegramInitData = createTelegramInitData(user);
  const userBody = {
    telegramInitData: telegramInitData,
    referrerTelegramId: user.referred_by_id,
    timeZone: user.time_zone,
  }
  const createUserResponse = await fetch(BASE_ROUTE + API_ROUTES.user, {
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
  if(user.wallet_id <= 0) {
    return true;
  }

  const telegramInitData = createTelegramInitData(user);
  const walletRequest = {
    telegramInitData: telegramInitData,
    tonWalletAddress: getWalletAddress(user.wallet_id, user.referral_group),
  }
  const addWalletResponse = await fetch(BASE_ROUTE + API_ROUTES.wallet, {
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
  if(!user.email) {
    return true;
  }

  // add email call
  const addEmailRequest = {
    telegramInitData: telegramInitData,
    email: user.email,
  }
  const addEmailResponse = await fetch(BASE_ROUTE + API_ROUTES.emailEntry, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(addEmailRequest),
  });
  const addEmailData = await addEmailResponse.json();
  console.log("Add email response:", addEmailData);

  if (!addEmailResponse.ok) {
    return false;
  } else if (!user.confirmed_email) {
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
    telegramId: user.telegram_id,
  }
  const confirmEmailResponse = await fetch(BASE_ROUTE + API_ROUTES.emailConfirm, {
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