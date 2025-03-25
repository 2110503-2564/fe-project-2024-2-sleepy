export default async function getReservations(token: string) {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = await fetch('https://backendmassageshop.onrender.com/api/v1/reservations', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch Reservations');
    }

    return await response.json();
}