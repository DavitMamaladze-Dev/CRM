'use client'

import { X } from 'lucide-react'

export const labelClass = 'text-xs font-medium text-[#6B7280]'

export const inputClass =
    'mt-1.5 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-3 text-base text-[#111827] outline-none focus:border-[#0E9B96] focus:ring-1 focus:ring-[#0E9B96] sm:py-2.5 sm:text-sm'

export default function SidePanel({ open, title, onClose, children }) {
    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-[60] flex justify-end bg-[#111827]/30 backdrop-blur-[2px]"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex h-dvh w-full flex-col bg-white shadow-2xl sm:w-[400px]"
            >
                <div className="flex shrink-0 items-center justify-between border-b border-[#EEF0F2] px-5 py-4">
                    <h2 className="text-lg font-semibold text-[#111827]">{title}</h2>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#111827]"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
            </div>
        </div>
    )
}