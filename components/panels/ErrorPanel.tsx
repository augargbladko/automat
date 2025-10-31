"use client"

import { Button } from "@nextui-org/react"
import { useCookies } from "next-client-cookies"

export function ErrorPanel(props: { error: string; cookieName: string }) {
  const cookies = useCookies()
  const onClick = () => {
    cookies.remove(props.cookieName)
    window.location.reload()
  }
  return (
    <div>
      <h1>Error:</h1>
      <p>{props.error}</p>
      <Button
        onClick={onClick}
        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        Clear Page Cookie and Reload
      </Button>
    </div>
  )
}
