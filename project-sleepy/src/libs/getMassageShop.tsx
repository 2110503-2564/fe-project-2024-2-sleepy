export default async function getMassageShops() {
    const response = await fetch('https://backendmassageshop.onrender.com/api/v1/massage-shops', {
        next: {
            revalidate: 3600
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch Venues");
    }

    return await response.json();
}