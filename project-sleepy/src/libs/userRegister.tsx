export default async function userRegister(name: string, tel: string, userEmail: string, userPassword: string) {
    const response = await fetch('https://backendmassageshop.onrender.com/api/v1/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            tel: tel,
            email: userEmail,
            password: userPassword,
            role: 'user'
        })
    })

    if (!response.ok) {
        throw new Error('Failed to register')
    }

    return await response.json()
}