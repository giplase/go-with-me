import { createClient } from "@/shared/supabase/client"

export type LoginFields = {
  login: string
  password: string
}

export async function signInWithEmail(formValues: LoginFields) {
  const supabase = createClient()
  const response = await supabase.auth.signInWithPassword({
    email: formValues.login,
    password: formValues.password,
  })

  const errorCode = response?.error?.code

  return {
    error: errorCode,
  }
}
