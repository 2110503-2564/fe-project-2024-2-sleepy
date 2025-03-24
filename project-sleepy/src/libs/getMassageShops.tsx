export default async function getMassageShops(page: number = 1) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const response = await fetch(`https://backendmassageshop.onrender.com/api/v1/massage-shops?page=${page}`, {
        next: {
            revalidate: 3600
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch Massage Shops");
    }

    return await response.json();
}