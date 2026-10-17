import apiClient from './client'

export async function getContacts() {
    const { data } = await apiClient.get('/api/crm/contacts/')
    return data
}

export async function createContact(contact) {
    const { data } = await apiClient.post('/api/crm/contacts/', contact)
    return data
}