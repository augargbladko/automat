/// <reference lib="deno.ns" />

import { UserData } from "../types/index.ts"

export async function subscribeProfileToList(user: UserData): Promise<boolean> {
  if (!user.email) {
    console.log(
      "No email provided, skipping Klaviyo subscription.",
      user.telegram_id
    )
    return true
  }

  try {
    const optInDate = new Date()
    optInDate.setMinutes(optInDate.getMinutes() - 2) // set to 2 minutes ago to avoid any timing issues
    const dataObject = {
      data: {
        type: "profile-subscription-bulk-create-job",
        attributes: {
          profiles: {
            data: [
              {
                type: "profile",
                attributes: {
                  email: user.email,
                  subscriptions: {
                    email: {
                      marketing: {
                        consent: "SUBSCRIBED",
                        consented_at: optInDate.toISOString(),
                      },
                    },
                  },
                },
              },
            ],
          },
          historical_import: true,
        },
        relationships: {
          list: {
            data: {
              type: "list",
              id: Deno.env.get("KLAYVIO_LIST_ID") || "",
            },
          },
        },
      },
    }

    const response = await fetch(
      `https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs`,
      {
        method: "POST",
        headers: {
          Authorization: `Klaviyo-API-Key ${Deno.env.get("KLAYVIO_API_KEY")}`,
          "Content-Type": "application/vnd.api+json",
          accept: "application/vnd.api+json",
          revision: "2025-10-15",
        },
        body: JSON.stringify(dataObject),
      }
    )

    if (!response.ok) {
      throw new Error(
        `Klaviyo API error: ${response.status} ${response.statusText}`
      )
    }

    return response.ok
  } catch (error) {
    console.error("Error opting user into list:", error)
    return false
  }
}
