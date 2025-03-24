'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaSearch } from "react-icons/fa";

const venuesData = [
  { id: 1, name: "Baansaifon Massage", location: "BANGKOK", stars: 5, price: "฿฿", image: "/venue1.png" },
  { id: 2, name: "INTER THAI Massage", location: "RAYONG", stars: 4, price: "฿฿฿", image: "/venue2.png" },
  { id: 3, name: "Inthef gene Massage", location: "BANGKOK", stars: 5, price: "฿฿฿฿", image: "/venue3.png" },
  { id: 4, name: "Angeles Massage", location: "BANGKOK", stars: 4, price: "฿฿", image: "/venue4.png" },
  { id: 5, name: "IKITHAI Massage", location: "NONTHABURI", stars: 5, price: "฿฿฿", image: "/venue5.png" },
  { id: 6, name: "Denver Massage", location: "BANGKOK", stars: 4, price: "฿฿", image: "/venue6.png" },
  { id: 7, name: "Lek Massage", location: "CHONBURI", stars: 4, price: "฿", image: "/venue7.png" },
  { id: 8, name: "SHUTTLE Massage", location: "BANGKOK", stars: 5, price: "฿฿฿", image: "/venue8.png" },
  { id: 9, name: "ZEN Massage", location: "BANGKOK", stars: 5, price: "฿฿฿฿", image: "/venue9.png" },
];

export default function VenueCatalog() {
  const [filter, setFilter] = useState("");
  const [venues, setVenues] = useState(venuesData);

  useEffect(() => {
    if (!filter) {
      setVenues(venuesData);
      return;
    }

    const filteredVenues = venuesData.filter(venue =>
      venue.name.toLowerCase().includes(filter.toLowerCase()) ||
      venue.location.toLowerCase().includes(filter.toLowerCase())
    );

    setVenues(filteredVenues);
  }, [filter]);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <h2 className="text-2xl font-bold flex-1">Popular Massage Shops</h2>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search venues..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all outline-none"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <Link
            href={`/venue/${venue.id}`}
            key={venue.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group"
          >
            <div className="relative w-full h-48">
              <Image
                src={venue.image}
                alt={venue.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 rounded-bl-lg font-medium">
                {venue.price}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800 group-hover:text-orange-500 transition-colors">{venue.name}</h3>
              <div className="flex justify-between items-center mt-2">
                <div className="flex">
                  {Array(5).fill(0).map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < venue.stars ? "text-yellow-500" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{venue.location}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}