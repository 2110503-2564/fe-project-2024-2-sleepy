export default async function getMassageShops() {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const response = await fetch('https://backendmassageshop.onrender.com/api/v1/massage-shops')

    if (!response.ok) {
        throw new Error("Failed to fetch Venues")
    }

    return await response.json()
}