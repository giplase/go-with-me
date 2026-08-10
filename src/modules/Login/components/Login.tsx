"use client"
import { Button, Field, Form } from "@base-ui/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { signInWithEmail } from "../api/Login"

export default function Login() {
  const [signError, setSignError] = useState<string | undefined>(undefined)
  const router = useRouter()

  return (
    <Form
      className="flex w-fit flex-col gap-5 rounded-2xl bg-[#02061288] px-11.25 py-10 text-sm shadow-[0_0_25px_#0E1223] backdrop-blur-xs"
      onFormSubmit={async (formValues) => {
        if (formValues.login.trim() === "" || formValues.password === "") {
          setSignError("empty_fields")
          return
        }

        const response = await signInWithEmail(formValues)
        if (response.error) {
          setSignError(response.error)
          console.log(signError)
        } else {
          router.push("/")
        }
      }}
    >
      <Field.Root name="login" className="flex w-xs flex-col gap-1.25">
        <Field.Label className="text-text-main">Логин</Field.Label>
        <Field.Control
          placeholder="Введите логин"
          type="email"
          className="text-text-main h-10 w-full rounded-md border border-[#FFFFFF40] p-2.5 placeholder:text-[#FFFFFF40] focus:outline-none"
        />
        <Field.Error className="text-red-700" />
      </Field.Root>

      <Field.Root name="password" className="flex w-xs flex-col gap-1.25">
        <Field.Label className="text-text-main">Пароль</Field.Label>
        <Field.Control
          placeholder="Введите пароль"
          type="password"
          className="text-text-main h-10 w-full rounded-md border border-[#FFFFFF40] p-2.5 placeholder:text-[#FFFFFF40] focus:outline-none"
        />
        <Field.Error className="text-red-700" />
      </Field.Root>

      {signError && (
        <p className="text-red-700">
          {signError === "invalid_credentials"
            ? "Неправильный логин или пароль."
            : signError === "empty_fields"
              ? "Введите логин и пароль."
              : "Произошла ошибка, попробуйте еще раз."}
        </p>
      )}

      <Button
        type="submit"
        className="text-text-main flex h-10 cursor-pointer items-center justify-center rounded-md border border-[#FFFFFF40]"
      >
        Войти
      </Button>
    </Form>
  )
}
