export default async function getMassageShop(mid: string) {
    const response = await fetch(`https://backendmassageshop.onrender.com/api/v1/massage-shops/${mid}`, {
        next: {
            revalidate: 3600
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch Massage Shop');
    }

    return await response.json();
}