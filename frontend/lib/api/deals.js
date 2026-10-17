import apiClient from './client'

export async function getDeals() {
    const { data } = await apiClient.get('/api/crm/deals/')
    return data
}

export async function createDeal(deal) {
    const { data } = await apiClient.post('/api/crm/deals/', deal)
    return data
}

export async function updateDealStage(id, stage) {
    const { data } = await apiClient.patch(`/api/crm/deals/${id}/`, { stage })
    return data
}