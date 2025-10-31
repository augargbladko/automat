import Link from "next/link"

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-2xl w-full p-4">
        <main className="flex-1 flex flex-col m-auto">
          <h1 className="text-center">Trade Analysis Database Homepage</h1>
          <h2>Blockchain DEX trade analysis</h2>
          <p>Looking at trades, tokens, and users on:</p>
          <ul className="list-disc list-inside">
            <li>Uniswap</li>
            <li>Sushiswap</li>
            <li>1Inch</li>
            <li>And more</li>
          </ul>
          <h2>Signal Analysis</h2>
          <p>
            <Link href={`/launch_signals`}>Launch Signals</Link> shows the
            latest launched tokens with lots of user support
          </p>
          <ul className="list-disc list-inside">
            <li>Buy data to act on purchases</li>
            <li>Sell data to act on sells</li>
          </ul>
          <h2>Account Analysis</h2>
          <p>
            <Link href={`/accounts`}>Accounts</Link> shows tracked accounts, and
            drills into detailed trades for individual accounts
          </p>
          <ul className="list-disc list-inside">
            <li>Scores (based on trading performance)</li>
            <li>Bear, bull, and flat market performance</li>
            <li>Trade counts</li>
            <li>Trade history</li>
          </ul>
          <h2>Tokens Analysis</h2>
          <p>
            <Link href={`/tokens`}>Tokens</Link> shows all major tokens,
            including:
          </p>
          <ul className="list-disc list-inside">
            <li>Spike count (short-term price increases)</li>
            <li>Trade volume</li>
            <li>Trade count</li>
            <li>GoPlus risk profile</li>
          </ul>
          <h2>Analytics</h2>
          <p>
            <Link href={`/accounts`}>Analytics</Link> shows data we use to
            fine-tune the model
          </p>
        </main>
      </div>
    </div>
  )
}
