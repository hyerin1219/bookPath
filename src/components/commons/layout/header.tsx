import Link from "next/link";

export default function Header() {
    return (
        <header className="flex items-center justify-between w-full p-3">
            <h1 className="w-[76px] h-[44px] bg-[url('/images/icon_logo.png')] bg-contain bg-no-repeat"><Link className="size-full" href="/dashboard"><span className="sr-only">책갈피</span></Link></h1>
            <button>로그인</button>
        </header>
    )
}