"use client"

import clsx from "clsx"
export function HighRisk({ children }: { children: any }) {
  return <p className="text-red-500 bold">{children}</p>
}
export function MediumRisk({ children }: { children: any }) {
  return <p className="text-yellow-500">{children}</p>
}
export function LowRisk({ children }: { children: any }) {
  return <p className="text-green-500">{children}</p>
}

export function GenericPanel({ children }: { children: any }) {
  return <div className="p-2 m-2 bg-gray-900 flex-1">{children}</div>
}
export function RowSection({ children }: { children: any }) {
  return <div className="flex flex-row">{children}</div>
}
export function DetailsSection({ children }: { children: any }) {
  return <div className="flex flex-col">{children}</div>
}
export function TableSection({
  children,
  className,
}: {
  children: any
  className?: string
}) {
  return (
    <div className={clsx(className, "flex flex-col w-full")}>{children}</div>
  )
}
export function TextSection({ children }: { children: any }) {
  return <div className="flex flex-col w-full m-2">{children}</div>
}
export function TextHeaderSection({ children }: { children: any }) {
  return <div className="flex flex-col w-full mx-2">{children}</div>
}
export function PageSection({ children }: { children: any }) {
  return (
    <div className="w-full pt-[60px] flex flex-col overflow-y-auto">
      {children}
    </div>
  )
}
export function tableClassNames(isFullScreen?: boolean) {
  return {
    base: clsx(
      `${
        isFullScreen ? "h-[calc(100vh-60px)] pt-2 " : "max-h-[80vh]"
      } gap-2 overflow-hidden`
    ),
    table: clsx(
      `${isFullScreen ? "max-h-[calc(100vh-60px)]" : "max-h-[80vh]"} py-0`
    ),
    wrapper: clsx("p-2"),
    row: clsx("h-60 bg-gray-800"),
  }
}
