export declare const Deno: {
  env: { get: (key: string) => string | undefined }
  serve: any
}

export const denoServe = Deno.serve
export const getEnvVar = (key: string): string => {
  return Deno.env.get(key) || ""
}
