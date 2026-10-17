'use client'

import { useEffect, useState } from 'react'
import {
    DndContext,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    useDraggable,
    useDroppable,
} from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import { getDeals, createDeal, updateDealStage } from '@/lib/api/deals'
import { getContacts } from '@/lib/api/contacts'
import SidePanel, { inputClass, labelClass } from '../../components/sidepanel'

const stages = [
    { key: 'new', label: 'New', accent: '#6B7280' },
    { key: 'contacted', label: 'Contacted', accent: '#0E9B96' },
    { key: 'proposal_sent', label: 'Proposal Sent', accent: '#2563EB' },
    { key: 'negotiation', label: 'Negotiation', accent: '#B68A3C' },
    { key: 'won', label: 'Won', accent: '#16A34A' },
    { key: 'lost', label: 'Lost', accent: '#DC2626' },
]

function DealCard({ deal }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: deal.id,
    })

    const style = transform
        ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 50 }
        : undefined

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`cursor-grab touch-manipulation select-none rounded-lg bg-white p-3.5 shadow-sm ring-1 ring-[#EEF0F2] active:cursor-grabbing ${
                isDragging ? 'opacity-60 shadow-lg' : ''
            }`}
        >
            <p className="truncate text-sm font-semibold text-[#111827]">{deal.title}</p>
            <p className="mt-1 truncate text-xs text-[#6B7280]">{deal.contact_name}</p>
            <p className="mt-2 text-sm font-medium text-[#0E9B96]">
                ${Number(deal.value).toLocaleString()}
            </p>
        </div>
    )
}

function Column({ stage, deals }) {
    const { setNodeRef, isOver } = useDroppable({ id: stage.key })
    const total = deals.reduce((sum, d) => sum + Number(d.value), 0)

    return (
        <div className="flex w-[78vw] max-w-[300px] shrink-0 snap-start flex-col sm:w-64 2xl:w-auto 2xl:max-w-none">
            <div
                className="flex items-center justify-between gap-2 rounded-t-lg bg-[#F9FAFB] px-3 py-2.5"
                style={{ borderTop: `3px solid ${stage.accent}` }}
            >
                <span className="truncate text-[13px] font-semibold text-[#111827]">
                    {stage.label}
                </span>
                <span className="shrink-0 text-xs text-[#6B7280]">{deals.length}</span>
            </div>
            <p className="truncate bg-[#F9FAFB] px-3 pb-2 text-xs text-[#6B7280]">
                ${total.toLocaleString()} total
            </p>

            <div
                ref={setNodeRef}
                className={`flex min-h-[280px] flex-1 flex-col gap-2 rounded-b-lg p-2 transition-colors ${
                    isOver ? 'bg-[#0E9B96]/10' : 'bg-[#F9FAFB]'
                }`}
            >
                {deals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                ))}
            </div>
        </div>
    )
}

export default function PipelinePage() {
    const [deals, setDeals] = useState([])
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(true)
    const [panelOpen, setPanelOpen] = useState(false)
    const [form, setForm] = useState({ contact: '', title: '', value: '' })
    const [saving, setSaving] = useState(false)

    
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } })
    )

    useEffect(() => {
        let cancelled = false

        async function load() {
            setLoading(true)
            try {
                const [dealsData, contactsData] = await Promise.all([getDeals(), getContacts()])
                if (!cancelled) {
                    setDeals(dealsData)
                    setContacts(contactsData)
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load()
        return () => { cancelled = true }
    }, [])

    async function handleDragEnd(event) {
        const { active, over } = event
        if (!over) return

        const dealId = active.id
        const newStage = over.id
        const deal = deals.find((d) => d.id === dealId)
        if (!deal || deal.stage === newStage) return

        setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d)))

        try {
            await updateDealStage(dealId, newStage)
        } catch {
            setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage: deal.stage } : d)))
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true)
        try {
            const newDeal = await createDeal(form)
            setDeals((prev) => [newDeal, ...prev])
            setForm({ contact: '', title: '', value: '' })
            setPanelOpen(false)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div style={{ colorScheme: 'light' }}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
                        Pipeline
                    </h1>
                    <p className="mt-1 text-sm text-[#6B7280]">
                        {loading ? 'Loading…' : `${deals.length} deals in motion`}
                    </p>
                </div>
                <button
                    onClick={() => setPanelOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0E9B96] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#0B7E7A] sm:w-auto sm:py-2.5"
                >
                    <Plus size={16} strokeWidth={2} />
                    Add deal
                </button>
            </div>

            <p className="mt-3 text-xs text-[#6B7280] md:hidden">
                Press and hold a deal, then drag it to another stage.
            </p>

            {!loading && (
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <div className="-mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-4 sm:mx-0 sm:mt-8 sm:px-0 2xl:grid 2xl:grid-cols-6 2xl:overflow-visible">
                        {stages.map((stage) => (
                            <Column
                                key={stage.key}
                                stage={stage}
                                deals={deals.filter((d) => d.stage === stage.key)}
                            />
                        ))}
                    </div>
                </DndContext>
            )}

            <SidePanel open={panelOpen} title="New deal" onClose={() => setPanelOpen(false)}>
                <form onSubmit={handleSubmit} className="flex min-h-full flex-col gap-4">
                    <div>
                        <label className={labelClass}>Contact</label>
                        <select
                            required
                            value={form.contact}
                            onChange={(e) => setForm({ ...form, contact: e.target.value })}
                            className={inputClass}
                        >
                            <option value="">Select a contact</option>
                            {contacts.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Deal title</label>
                        <input
                            required
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Value ($)</label>
                        <input
                            required
                            type="number"
                            inputMode="decimal"
                            value={form.value}
                            onChange={(e) => setForm({ ...form, value: e.target.value })}
                            className={inputClass}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="mt-auto rounded-lg bg-[#0E9B96] py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#0B7E7A] disabled:opacity-40"
                    >
                        {saving ? 'Saving…' : 'Create deal'}
                    </button>
                </form>
            </SidePanel>
        </div>
    )
}