'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, GitBranch, Menu } from 'lucide-react'

const navItems = [
    { href: '/contacts', label: 'Contacts', icon: Users },
    { href: '/pipeline', label: 'Pipeline', icon: GitBranch },
]

function Brand() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-[#2F6F4E] font-serif text-lg font-semibold text-[#2F6F4E]">
                P
            </div>
            <div>
                <div className="font-serif text-lg leading-tight tracking-tight text-[#EFEBE2]">
                    PipelineCRM
                </div>
                <div className="text-[11px] text-[#EFEBE2]/40">Ledger &amp; deals</div>
            </div>
        </div>
    )
}

export default function Shell({ children }) {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    return (
        <div className="min-h-dvh md:flex">
            {/* Mobile top bar */}
            <header className="sticky top-0 z-40 flex items-center justify-between bg-[#1A1812] px-4 py-3 md:hidden">
                <Brand />
                <button
                    onClick={() => setOpen(true)}
                    aria-label="Open menu"
                    className="flex h-10 w-10 items-center justify-center rounded-md text-[#EFEBE2] hover:bg-white/10"
                >
                    <Menu size={22} />
                </button>
            </header>

            {/* Overlay (mobile) */}
            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar: drawer on mobile, fixed column on desktop */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-hidden bg-[#1A1812] px-6 py-8 text-[#EFEBE2] transition-transform duration-200 md:sticky md:top-0 md:h-dvh md:shrink-0 md:translate-x-0 ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div
                    className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-[0.08]"
                    style={{ background: 'radial-gradient(circle, #2F6F4E 0%, transparent 70%)' }}
                />

                <div className="relative">
                    <Brand />
                </div>

                <nav className="relative mt-12 flex flex-col gap-1">
                    {navItems.map((item) => {
                        const active = pathname.startsWith(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`group flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors md:py-2.5 ${
                                    active
                                        ? 'bg-[#2F6F4E]/20 text-[#EFEBE2]'
                                        : 'text-[#EFEBE2]/55 hover:bg-[#2F6F4E]/15 hover:text-[#EFEBE2]'
                                }`}
                            >
                                <item.icon
                                    size={17}
                                    strokeWidth={1.75}
                                    className={
                                        active
                                            ? 'text-[#2F6F4E]'
                                            : 'text-[#EFEBE2]/40 group-hover:text-[#2F6F4E]'
                                    }
                                />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="relative mt-auto border-t border-[#EFEBE2]/10 pt-5">
                    <p className="text-xs leading-relaxed text-[#EFEBE2]/40">
                        Every contact starts a story.
                        <br />
                        Every deal closes one.
                    </p>
                </div>
            </aside>

            <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 md:px-8 md:py-10">
                {children}
            </main>
        </div>
    )
}