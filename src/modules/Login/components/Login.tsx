"use client"
import { Button, Form } from "@base-ui/react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { LoginFields, signInWithEmail } from "../api/Login"
import StyledFormField from "@/components/StyledFormField"

export default function Login() {
  const [signError, setSignError] = useState<string | undefined>(undefined)
  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  return (
    <Form
      className="bg-login-form-background shadow-[0_0_25px_theme(--color-login-form-background)] flex w-fit flex-col gap-5 rounded-2xl px-11.25 py-10 text-sm backdrop-blur-xs"
      onFormSubmit={(formValues: LoginFields) => {
        if (formValues.login.trim() === "" || formValues.password === "") {
          setSignError("empty_fields")
          return
        }
        startTransition(async () => {
          const response = await signInWithEmail(formValues)
          if (response.error) {
            setSignError(response.error)
            console.log(signError)
          } else {
            router.push("/")
          }
        })
      }}
    >
      <StyledFormField name="login" type="email" placeholder="Введите логин" label="Логин" />
      <StyledFormField name="password" type="password" placeholder="Введите пароль" label="Пароль" />

      {signError && (
        <p className="text-warning">
          {signError === "invalid_credentials"
            ? "Неправильный логин или пароль."
            : signError === "empty_fields"
              ? "Введите логин и пароль."
              : "Произошла ошибка, попробуйте еще раз."}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className={` ${!isPending ? "hover:bg-foreground" : ""}text-text-main disabled:bg-pending focus:outline-border hover:bg-hover border-border flex h-10 cursor-pointer items-center justify-center rounded-md border focus:outline-2 disabled:animate-pulse disabled:cursor-auto`}
      >
        Войти
      </Button>
    </Form>
  )
}
