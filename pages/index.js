export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#edf5ee] to-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full">
        <img
          src="https://images.unsplash.com/photo-1529119368496-2a3f85db6d8c?auto=format&fit=crop&w=1950&q=80"
          alt="Backpacker Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Where will you end up next?</h1>
          <p className="text-lg md:text-xl max-w-xl">
            Search anywhere. Leave anytime. Let spontaneity guide you.
          </p>
        </div>
      </section>
    </main>
  );
}
