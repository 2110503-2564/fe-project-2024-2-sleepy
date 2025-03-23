import Image from "next/image";

export default function Homepage() {
  return (
    <div className="relative rounded-xl overflow-hidden border-4 border-purple-500">
      <Image
        src="/Banner/Banner1.jpg"
        alt="Massage Promo Banner"
        width={1200}
        height={300}
        className="w-full h-auto object-cover"
      />
      <div className="absolute inset-0 flex flex-col items-start justify-center p-8 text-white bg-black/30">
        <h2 className="text-3xl font-bold mb-2">START MASSAGE</h2>
        <p className="mb-4">Relax and unwind with a soothing massage!</p>
        <button className="bg-white text-black px-4 py-2 rounded shadow font-semibold">LOGIN</button>
      </div>
    </div>
  );
}
