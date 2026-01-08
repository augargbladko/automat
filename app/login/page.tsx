import { createClient } from "@/components/utils/db/server"
import { redirect } from "next/navigation"
import { SubmitButton } from "./submit-button"

export default async function Login({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const params = await searchParams
  const signIn = async (formData: FormData) => {
    "use server"

    console.log("Login attempt")

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("login error", email, error.message)
      return redirect("/login?message=Could not authenticate user")
    }

    return redirect("/")
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 m-auto py-10">
      <h1>Trade Analysis App</h1>
      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-gray-200 border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-gray-200 border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <SubmitButton
          formAction={signIn}
          className="bg-green-500 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Signing In..."
        >
          Sign In
        </SubmitButton>
        {params?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {params.message}
          </p>
        )}
      </form>
    </div>
  )
}
