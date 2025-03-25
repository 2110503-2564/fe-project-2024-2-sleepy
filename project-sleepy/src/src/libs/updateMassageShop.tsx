export default async function updateMassageShop(token: string, mid: string, name:string, address:string, district:string, province:string, postalcode:string, tel:string, openTime:string, closeTime:string) {
    const response = await fetch(`https://backendmassageshop.onrender.com/api/v1/massage-shops/${mid}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            address: address,
            district: district,
            province: province,
            postalcode: postalcode,
            tel: tel,
            openTime: openTime,
            closeTime: closeTime
        })
    });

    if (!response.ok) {
        throw new Error('Failed to update massage shops');
    }

    return await response.json();
}