"use client"

import { Pagination } from "@nextui-org/react"
import { TableParams } from "../utils"

export function TablePagination(params: TableParams) {
  const { queries, count, onFilter } = params
  const { pageSize } = queries
  const pages = Math.ceil(count / pageSize) || 1
  if (queries.page > pages) {
    queries.page = pages
  }
  const { page } = queries

  return (
    <div className="flex w-full justify-center z-0">
      <div className="flex-1 flex justify-end">
        <p className="mx-2 content-center text-xs">
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
            if (onFilter) {
              onFilter({ ...queries, page: newPage })
            }
          }}
        />
      </div>
      <div className="flex-1 flex justify-start"></div>
    </div>
  )
}
