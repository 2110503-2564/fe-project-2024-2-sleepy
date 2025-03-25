import Homepage from "@/components/Homepage";

export default function Home() {
  return (
    <main className="min-h-screen bg-white pb-8">
      <section className="container mx-auto mt-10 px-4">
        <Homepage />
      </section>

      <footer className="mt-16 py-8 border-t text-center text-sm text-gray-500 bg-white">
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