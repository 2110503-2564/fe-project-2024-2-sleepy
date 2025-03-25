export default async function removeReservation(token: string, reservID: string) {
    const response = await fetch(`https://backendmassageshop.onrender.com/api/v1/reservations/${reservID}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to remove reservation');
    }

    return await response.json();
}