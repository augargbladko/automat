/*
   'https://a.klaviyo.com/api/profiles?page[size]=20'
     --header 'Authorization: Klaviyo-API-Key your-private-api-key'
     --header 'accept: application/vnd.api+json'
--header 'revision: 2025-10-15'
     */

import { getWalletAddress } from "../ton/tonWallet.ts";
import { SupabaseUser } from "./types.ts";

export async function subscribeProfileToList(user: SupabaseUser): Promise<boolean> {
  if(!user.email) {
    console.log('No email provided, skipping Klaviyo subscription.', user.telegram_id);
    return true;
  }
  const profileId = await subcribeOrUpdateEmail(user);
  console.log('Klaviyo profile ID:', profileId);
  if (profileId) {
    return await optUserIntoList(profileId, user.email);
  } else { return false; }
}

async function optUserIntoList(profileId: string, email: string) {
  try {
    const optInDate = new Date();
    optInDate.setMinutes(optInDate.getMinutes() - 2); // set to 2 minutes ago to avoid any timing issues
    const data = {
      data: {
        type: "profile-subscription-bulk-create-job",
        attributes: {
          historical_import: true,
          profiles: {
            data: [
              {
                type: "profile",
                id: profileId,
                attributes: {
                  email: email,
                  subscriptions: {
                    email: {
                      marketing: {
                        consent: "SUBSCRIBED",
                        consented_at: optInDate.toISOString(),
                      }
                    },
                  }
                }
              }]
          }
        },
        relationships: {
          list: {
            data: {
              type: "list",
              id: Deno.env.get('KLAYVIO_LIST_ID') || ''
            }
          }
        }
      }
    }
    console.log('Klaviyo opt-in data:', data);

    const response = await fetch(`https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs`, {
      method: 'POST',
      headers: {
        Authorization: `Klaviyo-API-Key ${Deno.env.get('KLAYVIO_API_KEY')}`,
        'Content-Type': 'application/vnd.api+json',
        accept: 'application/vnd.api+json',
        revision: '2025-07-15',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(
        `Klaviyo API error: ${response.status} ${response.statusText}`,
      );
    }

    const body = await response.json();
    console.log('Klaviyo opt-in response body:', body);
    return response.ok;
  } catch (error) {
    console.error('Error opting user into list:', error);
    return false;
  }
}

async function subcribeOrUpdateEmail(
  user: SupabaseUser
): Promise<string> {
  const { email, first_name, username, telegram_id, is_premium, wallet_id } = user;
  const tonWalletAddress = getWalletAddress(wallet_id);

  try {
    const response = await fetch('https://a.klaviyo.com/api/profile-import', {
      method: 'POST',
      headers: {
        Authorization: `Klaviyo-API-Key ${Deno.env.get('KLAYVIO_API_KEY')}`,
        'Content-Type': 'application/vnd.api+json',
        accept: 'application/vnd.api+json',
        revision: '2025-07-15',
      },
      body: JSON.stringify({
        data: {
          type: 'profile',
          attributes: {
            email: email,
            first_name: first_name || username || null,
            external_id: telegram_id,
            title: username || null,
            image: null,
            properties: {
              telegram_id: telegram_id,
              user_name: username,
              ton_wallet: tonWalletAddress,
              is_premium: is_premium,
            },
          },
        },
      }),
    });
    console.log('Klayvio response', response);

    if (!response.ok) {
      throw new Error(
        `Klaviyo API error: ${response.status} ${response.statusText}`,
      );
    }

    const body = await response.json();
    console.log('Klaviyo response body:', body);

    return body?.data?.id || '';
  } catch (error) {
    console.error('Error subscribing or updating email:', error);
    return '';
  }
}