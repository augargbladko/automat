import { getAnalytics } from "@/calls/analytics"
import { UserStatus } from "@/supabase/functions/users/data/types"
import Link from "next/link"

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 w-full p-4">
        <main className="flex-1 flex flex-col m-auto">
          <h1 className="text-center">Gold Mining Tech</h1>
          <h2>Analytics</h2>
          <p>
            <Link href={`/accounts`}>Analytics</Link> shows data we use to
            fine-tune the model
          </p>
          <AnalyticsBlock />
        </main>
      </div>
    </div>
  )
}

const statuses: UserStatus[] = Object.values(UserStatus)

export async function AnalyticsBlock() {
  const analytics = await getAnalytics()
  const dataPoints = []
  const statusPoints: number[] = []
  while (statusPoints.length < statuses.length) {
    statusPoints.push(0)
  }
  analytics.map((a) => {
    while (dataPoints.length < a.referral_group + 1) {
      dataPoints.push({ group: a.referral_group, nugs: 0, count: 0 })
    }
    const point = dataPoints[a.referral_group]
    point.nugs += a.sum || 0
    point.count += a.count || 0
    point[a.user_status] = { nugs: a.sum || 0, count: a.count || 0 }
    const statusIndex = statuses.indexOf(a.user_status as UserStatus)
    if (statusIndex >= 0) {
      statusPoints[statusIndex] += a.count || 0
    }
  })
  const statusesToShow = statuses.filter((_, idx) => statusPoints[idx] > 0)
  return (
    <div>
      <h2>Analytics Block</h2>
      <table className="text-xs border-separate border-spacing-x-2 whitespace-nowrap">
        <thead>
          <tr>
            <th>Group</th>
            <th>NUGS</th>
            <th>Users</th>
            <th colSpan={10}>User count by status</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            {statusesToShow.map((status) => (
              <th key={status}>{status}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total</td>
            <td>{dataPoints.reduce((acc, dp) => acc + dp.nugs, 0)}</td>
            <td>{dataPoints.reduce((acc, dp) => acc + dp.count, 0)}</td>
            {statusesToShow.map((status) => (
              <td key={status}>
                {dataPoints.reduce(
                  (acc, dp) => acc + (dp[status]?.count || 0),
                  0
                )}
              </td>
            ))}
          </tr>
          {dataPoints.map((dp, idx) => (
            <tr key={idx}>
              <td>{dp.group}</td>
              <td>{dp.nugs}</td>
              <td>{dp.count}</td>
              {statusesToShow.map((status) => (
                <td key={status}>{dp[status]?.count || 0}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
