const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Expose-Headers": "Content-Length, X-JSON",
  "Access-Control-Allow-Headers":
    "apikey,X-Client-Info, Content-Type, Authorization, Accept, Accept-Language, X-Authorization",
}

export const handleCORS = (cb: (req: Request) => Promise<Response>) => {
  return async (req: Request) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders })
    }

    const response = await cb(req)
    Object.entries(corsHeaders).forEach(([header, value]) => {
      response.headers.set(header, value)
    })

    return response
  }
}
