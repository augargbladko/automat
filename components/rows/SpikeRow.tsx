import { Spike, Token } from "@/supabase/functions/types"

export function SpikeScoreRow({
  spike,
  token,
}: {
  spike: Spike
  token: Token
}) {
  return (
    <div
      key={spike.token + spike.day}
      className="text-lg font-bold text-gray-900;"
    >
      <p>{JSON.stringify(spike, null, 2)}</p>
      <p>{JSON.stringify(token, null, 2)}</p>
    </div>
  )
}
