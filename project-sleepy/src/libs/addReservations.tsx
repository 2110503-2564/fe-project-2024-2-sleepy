export default async function addReservations(token: string, massageShopID: string, reservDate: any) {
    const response = await fetch(`https://backendmassageshop.onrender.com/api/v1/massage-shops/${massageShopID}/reservations`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            reservDate: reservDate,
        })
    });

    if (!response.ok) {
        throw new Error('Failed to add reservation');
    }
    
    return await response.json();
}