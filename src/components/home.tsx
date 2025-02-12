import React from "react";
import Header from "./Header";
import MobileNav from "./MobileNav";
import PropertyGrid from "./PropertyGrid";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header isMapSearchMode={false} />
      <MobileNav />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Featured Properties</h1>
        <PropertyGrid />
      </main>
    </div>
  );
};

export default Home;
