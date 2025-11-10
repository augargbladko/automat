import Link from "next/link"

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-2xl w-full p-4">
        <main className="flex-1 flex flex-col m-auto">
          <h1 className="text-center">Gold Mining Tech</h1>
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
