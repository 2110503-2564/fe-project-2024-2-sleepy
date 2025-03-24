import Image from "next/image";

export default function Banner({ text1, text2 }: { text1: string, text2: string }) {
    return (
        <div className="relative w-full h-[600px] mb-12 overflow-hidden rounded-xl shadow-xl">
            <Image
                src='/Banner/Banner1.jpg'
                alt='Banner'
                fill
                priority
                className="object-cover object-center brightness-90"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
                    <span className="relative">
                        {text1}
                        <span className="absolute -bottom-2 left-0 w-full h-1 bg-orange-500 rounded-full"></span>
                    </span>
                </h1>
                <h3 className="text-2xl md:text-3xl font-medium text-white max-w-2xl">{text2}</h3>

                <button className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-8 rounded-lg font-bold text-lg shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105">
                    Find Your Perfect Massage
                </button>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>
        </div>
    );
}