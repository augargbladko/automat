import { SpikeScore, Token } from "@/supabase/functions/types"

export function SpikeScoreRow({
  score,
  token,
}: {
  score: SpikeScore
  token: Token
}) {
  return (
    <div>
      <h2>
        Spike: {token?.name || score.token} {score.day}
      </h2>
      <p>{JSON.stringify(score, null, 2)}</p>
      <p>{JSON.stringify(token, null, 2)}</p>
    </div>
  )
}
