import { createClient } from "@/shared/supabase/client"
import { Form } from "@base-ui/react"

export async function signInWithEmail(formValues: Form.Values) {
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
