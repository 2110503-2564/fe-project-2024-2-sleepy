export default async function getUserProfile(token: string) {
    const response = await fetch('https://backendmassageshop.onrender.com/api/v1/auth/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error('Failed to get user profile')
    }

    return await response.json()
}
