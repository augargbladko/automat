import { Account } from "@/supabase/functions/types"

export function AccountRow({ account }: { account: Account }) {
  return (
    <div key={account.address}>
      <p>{JSON.stringify(account, null, 2)}</p>
    </div>
  )
}
