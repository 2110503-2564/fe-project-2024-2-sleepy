export default async function updateReservation(token: string, reservID: string, reservDate: any) {
    const response = await fetch(`https://backendmassageshop.onrender.com/api/v1/reservations/${reservID}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            reservDate: reservDate,
        })
    });

    if (!response.ok) {
        throw new Error('Failed to update reservation');
    }

    return await response.json();
}