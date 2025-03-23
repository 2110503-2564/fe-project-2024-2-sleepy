import Image from "next/image";

const massageShops = [
  { name: "Baansaifon Massage", location: "BANGKOK", image: "/venue1.png" },
  { name: "INTER THAI Massage", location: "RAYONG", image: "/venue2.png" },
  { name: "Inthef gene Massage", location: "BANGKOK", image: "/venue3.png" },
  { name: "Angeles Massage", location: "BANGKOK", image: "/venue4.png" },
  { name: "IKITHAI Massage", location: "NONTHABURI", image: "/venue5.png" },
  { name: "Denver Massage", location: "BANGKOK", image: "/venue6.png" },
  { name: "Lek Massage", location: "CHONBURI", image: "/venue7.png" },
  { name: "SHUTTLE Massage", location: "BANGKOK", image: "/venue8.png" },
  { name: "ZEN Massage", location: "BANGKOK", image: "/venue9.png" },
];

export default function VenueCatalog() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {massageShops.map((massageShop, index) => (
        <div
          key={index}
          className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition"
        >
          <div className="relative w-full h-40">
            <Image
              src={massageShop.image}
              alt={massageShop.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg">{massageShop.name}</h3>
            <p className="text-sm text-gray-500">5 STAR {massageShop.location}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
