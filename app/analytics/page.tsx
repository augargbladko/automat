import { Suspense } from "react"
import { ScoreCounts, ScoreLoading, WinLossData } from "."

function getStartEnd(endDaysAgo: number, totalDays: number): WinLossData {
  const start = new Date(Date.now() - (endDaysAgo + totalDays) * 86400000)
  const end = new Date(Date.now() - endDaysAgo * 86400000)

  const result = {
    startDay: `${start.getUTCFullYear()}-${start.getUTCMonth() + 1}-${start.getUTCDate()}`,
    endDay: `${end.getUTCFullYear()}-${end.getUTCMonth() + 1}-${end.getUTCDate()}`,
  }
  return result
}

export default async function AnalyticsPage() {
  const start = 0 // 365 * 2
  const weeks26 = 26 * 7
  const data4 = getStartEnd(start + 0, weeks26)
  const data3 = getStartEnd(start + weeks26 + 1, weeks26)
  const data2 = getStartEnd(start + weeks26 * 2 + 1, weeks26)
  const data1 = getStartEnd(start + weeks26 * 3 + 1, weeks26)
  const data0 = getStartEnd(start + weeks26 * 4 + 1, weeks26)
  const datan = getStartEnd(start + weeks26 * 5 + 1, weeks26)

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-evenly w-fit min-w-full mx-2">
        <Suspense fallback={<ScoreLoading data={data4} />}>
          <ScoreCounts data={datan} />
        </Suspense>
        <Suspense fallback={<ScoreLoading data={data4} />}>
          <ScoreCounts data={data0} />
        </Suspense>
        <Suspense fallback={<ScoreLoading data={data1} />}>
          <ScoreCounts data={data1} />
        </Suspense>
        <Suspense fallback={<ScoreLoading data={data2} />}>
          <ScoreCounts data={data2} />
        </Suspense>
        <Suspense fallback={<ScoreLoading data={data3} />}>
          <ScoreCounts data={data3} />
        </Suspense>
        <Suspense fallback={<ScoreLoading data={data4} />}>
          <ScoreCounts data={data4} />
        </Suspense>
      </div>
    </div>
  )
}
