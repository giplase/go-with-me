import Image from 'next/image'

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className='w-screen h-screen'>
            <Image
                src="/login-bg-map.jpg"
                style={{
                    objectFit: "cover",
                }}
                fill={true}
                alt="Background map"
            />
            <div className='absolute w-screen h-screen bg-[#152142BD] flex items-center justify-center'>{children}</div>
        </div>
    );
}