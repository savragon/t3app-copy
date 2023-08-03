// Main.tsx
import React from "react";
import { FaBars } from "react-icons/fa";

export default function Main() {
  return (
    <div className="bg-custom h-screen w-full bg-cover bg-center bg-no-repeat font-medium">
      <FaBars className="fixed left-5 top-5 text-3xl text-white" />
      <div className="items-center justify-center bg-emerald-500 p-5 text-white">
        <h1 className="text-center text-3xl">CarSpot</h1>
      </div>
      {/* Add the rest of your content for the Main component */}
      {/* For example, you can add a navigation bar, cards, or other elements */}
    </div>
  );
}
