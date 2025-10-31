import { Database, Tables } from "@/supabase/functions/types"
import { delay } from "@/supabase/functions/utils"
import {
  createServerComponentClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function getSupabase(): Promise<SupabaseClient> {
  const cookieStore = cookies()
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  })
  return supabase as unknown as SupabaseClient
}

export enum ColumnToCount {
  as_2_score = "as_2_score",
  d5_2_score = "d5_2_score",
  d5_3_score = "d5_3_score",
  d5_4_score = "d5_4_score",
}

export interface WinLossData {
  startDay: string
  endDay: string
  column?: ColumnToCount
  targetScore?: number
  doubles?: number
  wins?: number
  losses?: number
}

export async function ScoreCounts({ data }: { data: WinLossData }) {
  const as2_results = await getCountArray({
    ...data,
    column: ColumnToCount.as_2_score,
  })
  const as3_results = {} /*await getCountArray({
    ...data,
    column: ColumnToCount.d5_2_score,
  })*/
  if (!as2_results || !as3_results) {
    return <div>Results fail for data: {JSON.stringify(data)}</div>
  }

  function ResultsRow({
    title,
    as2,
    //as3,
  }: {
    title: string
    as2: string
    //as3: string
  }) {
    return (
      <div key={title} className="flex flex-row text-xs">
        <div className="w-12">{title}</div>
        <div className="w-24">{as2}</div>
        {/*<div className="w-24">{as3}</div>*/}
      </div>
    )
  }

  function ResultsGrid() {
    // console.log(`target,win%,2x,1x,loss`)
    return (
      <div>
        <ResultsRow title="Target" as2="%  2x|1x(loss)" /*as3="3+ wins"*/ />
        {countList.map((target, index) => {
          const a2 = as2_results[index]
          /*console.log(
            `${a2.targetScore},${a2.startDay} to ${a2.endDay},${Math.floor((a2.wins / Math.max(1, a2.wins + a2.losses)) * 100)}%,${a2.doubles},${a2.wins - a2.doubles},${a2.losses},`
          )*/
          //const a3 = as3_results[index]
          return (
            <ResultsRow
              key={index}
              title={target.toString()}
              as2={`${Math.floor((a2.wins / Math.max(1, a2.wins + a2.losses)) * 100)}% ${a2.doubles}|${a2.wins - a2.doubles}(${a2.losses})`}
              //as3={`${Math.floor((a3.wins / Math.max(1, a3.wins + a3.losses)) * 100)}% (${a3.wins}/${a3.losses})`}
            />
          )
        })}
      </div>
    )
  }
  return (
    <div>
      <h2>
        {data.startDay} to {data.endDay}
      </h2>
      <ResultsGrid />
    </div>
  )
}

export function ScoreLoading({ data }: { data: WinLossData }) {
  return (
    <div>
      <h2>
        {data.startDay} to {data.endDay}
      </h2>
      <p>Loading...</p>
    </div>
  )
}

export const countList = [
  5, 10, 15, 20, 25, 30, 35, 37, 40, 45, 50, 60, 70, 80, 90, 100,
]

/*export const countList = [
  60, 80, 100, 120, 130, 140, 150, 160, 170, 180, 200, 250, 300, 350, 400, 450,
  500,
]*/

async function getCountArray(data: WinLossData): Promise<WinLossData[]> {
  const supabase = await getSupabase()
  const queries = countList.map(async (targetScore, index) => {
    const counts = await getCounts(supabase, { ...data, targetScore }, index)
    return counts
  })
  const results = await Promise.all(queries)
  return results
}

export async function getCounts(
  supabase: SupabaseClient,
  data: WinLossData,
  index: number
): Promise<WinLossData> {
  await delay(index * 50)
  const { startDay, endDay, column, targetScore } = data
  // 200 is the limit for AWS query strings
  let isSuccess = true
  async function getCount(score: number) {
    const { count, error } = await supabase
      .from(Tables.tokens)
      .select("*", { count: "exact", head: true })
      .gte("first_dex_day", startDay)
      .lte("first_dex_day", endDay)
      .gte(column, targetScore)
      .gte("launch_score", score)
      .gte("d0_volume", 1000000)
    if (error) {
      console.error("error getting count", error)
      isSuccess = false
      return 0
    }
    return count
  }
  if (isSuccess) {
    data.doubles = await getCount(2)
    data.wins = await getCount(1)
    data.losses = (await getCount(0)) - data.wins
  } else {
    data.doubles = -1
    data.wins = -1
    data.losses = -1
  }
  return data
}
