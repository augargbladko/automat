"use client"

import { Link } from "@nextui-org/react"
import clsx from "clsx"
import { usePathname } from "next/navigation"
import { accountName } from "./utils"

enum MainPaths {
  Analysis = "analysis",
  Accounts = "accounts",
  Tokens = "tokens",
  Signals = "launch_signals",
  Adopters = "adopters",
  Analytics = "analytics",
  Home = "",
}

const pathTitles: { [key in MainPaths]: string } = {
  [MainPaths.Analysis]: "Analysis",
  [MainPaths.Accounts]: "Accounts",
  [MainPaths.Tokens]: "Tokens",
  [MainPaths.Signals]: "Signals",
  [MainPaths.Home]: "Home",
  [MainPaths.Adopters]: "Early Adopters",
  [MainPaths.Analytics]: "Analytics",
}

export function Header() {
  return (
    <div className="h-[60px] w-full bg-purple-950 fixed flex flex-row justify-between items-center overflow-hidden z-10">
      <div className="w-200px flex flex-row flex-1 mx-4">
        <HeaderLink path={MainPaths.Home} />
        <HeaderLink path={MainPaths.Analysis} />
        <HeaderLink path={MainPaths.Signals} />
        <HeaderLink path={MainPaths.Accounts} />
        <HeaderLink path={MainPaths.Tokens} />
        <HeaderLink path={MainPaths.Adopters} />
        <HeaderLink path={MainPaths.Analytics} />
      </div>
      <div className="w-200px flex flex-col mx-4 text-right">
        <h3>Trade Analysis DB</h3>
        <div className="text-xs">Subtitle</div>
      </div>
    </div>
  )
}

function HeaderLink({ path }: { path: MainPaths }) {
  const title = pathTitles[path]

  const pathname = usePathname()
  const paths = pathname.split("/")
  const currentPath =
    paths.length > 1 ? (paths[1] as MainPaths) : MainPaths.Home
  const isSelected = path === currentPath
  const hasSubPath = isSelected && paths.length > 2
  const hasDetailsPath = isSelected && paths.length > 3
  let subtitle = hasSubPath
    ? `${accountName(paths[2])}${hasDetailsPath ? ": Details" : ""}`
    : ""

  return (
    <div className="mx-4 mt-4 flex flex-col">
      <Link
        className={clsx(
          "font-bold font-lg underline-offset-4",
          isSelected && "text-blue-400 underline"
        )}
        href={`/${path}`}
      >
        {title}
      </Link>
      <div className="text-xs mx-auto text-blue-400 h-4">{subtitle}</div>
    </div>
  )
}
