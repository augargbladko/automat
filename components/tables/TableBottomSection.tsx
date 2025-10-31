"use client"

import { Button, Pagination } from "@nextui-org/react"
import clsx from "clsx"
import { useCookies } from "next-client-cookies"
import { useRouter } from "next/navigation"
import { Queries, TableParams, defaultFilters } from "../utils"

export function TableBottomSection(params: TableParams) {
  const router = useRouter()
  const cookies = useCookies()
  const { queries, count, cookie, filterSection } = params
  const { pageSize } = queries
  const pages = Math.ceil(count / pageSize) || 1
  if (queries.page > pages) {
    queries.page = pages
  }
  const { page } = queries

  const onNavigate = (newQueries: Queries) => {
    cookies.set(cookie, JSON.stringify(newQueries), {
      expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365),
    })
    router.refresh()
  }
  return (
    <div className="flex w-full justify-center align-center z-0">
      {filterSection && (
        <div className="flex-1 flex justify-end">{filterSection}</div>
      )}
      <div
        className={clsx(
          !filterSection ? "flex-1 flex justify-end" : "flex justify-end"
        )}
      >
        <p className="mx-2 content-center">
          {(page - 1) * pageSize}-{Math.min(count, page * pageSize)} of {count}
        </p>
      </div>
      <div className="flex">
        <Pagination
          showControls
          showShadow
          isCompact
          siblings={3}
          color="secondary"
          page={page}
          total={pages}
          classNames={{
            item: "text-xs h-7",
            cursor: "text-xs h-7",
            prev: "text-xs h-7",
            next: "text-xs h-7",
          }}
          className="my-auto py-0"
          onChange={(newPage) => {
            if (onNavigate) {
              onNavigate({ ...queries, page: newPage })
            }
          }}
        />
      </div>
      <div className="flex-1 flex-row justify-start h-7 my-auto">
        <Button
          className="h-7 mx-2 text-xs my-auto"
          onClick={() => onNavigate({ ...defaultFilters[params.cookie] })}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
