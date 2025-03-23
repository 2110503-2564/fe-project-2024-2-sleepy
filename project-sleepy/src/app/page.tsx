import Homepage from "@/components/Homepage";
import VenueCatalog from "@/components/VenueCatalog";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Banner Section */}
      <section className="container mx-auto mt-40 px-4">
        <Homepage />
      </section>

      {/* Popular Right Now */}
      <section className="container mx-auto px-4 mt-12">
        <h2 className="text-xl font-semibold mb-4">Popular right now</h2>
        <VenueCatalog />
      </section>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t text-center text-sm text-gray-500">
        <div>helpservice@bookingmassage.co.th</div>
        <div className="flex justify-center space-x-6 mt-2">
          <span>💆 massage booking</span>
          <span>📺 massage booking channel</span>
          <span>📱 @massage_booking</span>
        </div>
      </footer>
    </main>
  );
}