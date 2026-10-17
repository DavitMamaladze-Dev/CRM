'use client'

import { useEffect, useState } from 'react'
import { Plus, Mail, Building2, Users } from 'lucide-react'
import { getContacts, createContact } from '../../lib/api/contacts'
import SidePanel, { inputClass, labelClass } from '../../components/sidepanel'

const sourceStyles = {
    website: { accent: '#0E9B96', label: 'Website' },
    referral: { accent: '#B68A3C', label: 'Referral' },
    cold_outreach: { accent: '#C2410C', label: 'Cold Outreach' },
    other: { accent: '#6B7280', label: 'Other' },
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(true)
    const [panelOpen, setPanelOpen] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', source: 'website' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        let cancelled = false

        async function loadContacts() {
            setLoading(true)
            try {
                const data = await getContacts()
                if (!cancelled) setContacts(data)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        loadContacts()
        return () => { cancelled = true }
    }, [])

    async function refetch() {
        const data = await getContacts()
        setContacts(data)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true)
        try {
            await createContact(form)
            setForm({ name: '', email: '', phone: '', company: '', source: 'website' })
            setPanelOpen(false)
            await refetch()
        } finally {
            setSaving(false)
        }
    }

    const counts = contacts.reduce((acc, c) => {
        acc[c.source] = (acc[c.source] || 0) + 1
        return acc
    }, {})

    return (
        <div style={{ colorScheme: 'light' }}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
                        Contacts
                    </h1>
                    <p className="mt-1 text-sm text-[#6B7280]">
                        {loading ? 'Loading…' : `${contacts.length} people in your pipeline`}
                    </p>
                </div>
                <button
                    onClick={() => setPanelOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0E9B96] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#0B7E7A] sm:w-auto sm:py-2.5"
                >
                    <Plus size={16} strokeWidth={2} />
                    Add contact
                </button>
            </div>

            {!loading && contacts.length > 0 && (
                <div className="mt-6 flex h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
                    {Object.entries(sourceStyles).map(([key, s]) =>
                        counts[key] ? (
                            <div
                                key={key}
                                style={{
                                    backgroundColor: s.accent,
                                    width: `${(counts[key] / contacts.length) * 100}%`,
                                }}
                            />
                        ) : null
                    )}
                </div>
            )}

            <div className="mt-6 sm:mt-8">
                {loading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 animate-pulse rounded-xl bg-[#F3F4F6]" />
                        ))}
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E5E7EB] px-6 py-20 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3F4F6]">
                            <Users className="text-[#9CA3AF]" size={20} />
                        </div>
                        <p className="mt-4 text-sm font-medium text-[#111827]">No contacts yet</p>
                        <p className="mt-1 text-sm text-[#6B7280]">
                            Add your first one to start the pipeline.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {contacts.map((c) => {
                            const src = sourceStyles[c.source] || sourceStyles.other
                            return (
                                <div
                                    key={c.id}
                                    className="flex items-center gap-3 rounded-xl bg-white py-3.5 pl-3.5 pr-3.5 shadow-sm ring-1 ring-[#EEF0F2] transition-shadow hover:shadow-md sm:gap-4 sm:pl-4 sm:pr-5 sm:py-4"
                                    style={{ borderLeft: `3px solid ${src.accent}` }}
                                >
                                    <div
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                                        style={{ backgroundColor: src.accent }}
                                    >
                                        {c.name.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-[#111827]">
                                            {c.name}
                                        </p>
                                        <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[#6B7280]">
                                            {c.email && (
                                                <span className="flex min-w-0 max-w-full items-center gap-1">
                                                    <Mail size={12} className="shrink-0" />
                                                    <span className="truncate">{c.email}</span>
                                                </span>
                                            )}
                                            {c.company && (
                                                <span className="flex min-w-0 max-w-full items-center gap-1">
                                                    <Building2 size={12} className="shrink-0" />
                                                    <span className="truncate">{c.company}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <span
                                        className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium text-white sm:text-xs"
                                        style={{ backgroundColor: src.accent }}
                                    >
                                        {src.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <SidePanel open={panelOpen} title="New contact" onClose={() => setPanelOpen(false)}>
                <form onSubmit={handleSubmit} className="flex min-h-full flex-col gap-4">
                    <div>
                        <label className={labelClass}>Name</label>
                        <input
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Phone</label>
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Company</label>
                        <input
                            value={form.company}
                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Source</label>
                        <select
                            value={form.source}
                            onChange={(e) => setForm({ ...form, source: e.target.value })}
                            className={inputClass}
                        >
                            <option value="website">Website</option>
                            <option value="referral">Referral</option>
                            <option value="cold_outreach">Cold Outreach</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="mt-auto rounded-lg bg-[#0E9B96] py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#0B7E7A] disabled:opacity-40"
                    >
                        {saving ? 'Saving…' : 'Save contact'}
                    </button>
                </form>
            </SidePanel>
        </div>
    )
}