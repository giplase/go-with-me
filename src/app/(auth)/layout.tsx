import Image from "next/image"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative h-screen w-screen">
      <Image src="/login-bg-map.jpg" className="object-cover" fill={true} alt="Background map" />
      <div className="bg-login-background absolute flex h-screen w-screen items-center justify-center">{children}</div>
    </div>
  )
}
