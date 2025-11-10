// This should run use the params to fire Telegram and Google analytics events
// call /analytics?=tgInitData to log the events we want.

// open via a mo

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-2xl w-full p-4">
        <main className="flex-1 flex flex-col m-auto">
          <p>Analytics Goes here</p>
        </main>
      </div>
    </div>
  )
}
