export default async function getMassageShop(id:string) {
    const response = await fetch(`https://backendmassageshop.onrender.com/api/v1/massage-shops/${id}`)
    if(!response.ok){
        throw new Error("Failed to fetch Venues")
    }

    return await response.json()
}