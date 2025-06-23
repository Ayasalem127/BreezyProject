"use client"
import Searchbar from "@/components/Searchbar";
import Subscriptions from "@/components/Subscriptions";
import UsersSuggestionMobile from "@/components/UsersSuggestionMobile";


import { useState } from "react";


export default function Home() {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="w-full px-2 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4 p-10">Utilisateurs</h1>
      
      <Searchbar searchText={searchText} setSearchText={setSearchText} />
      
      <Subscriptions searchText={searchText} />

      <div className="block sm:hidden mt-10">
        <UsersSuggestionMobile />
      </div>
    </div>
  );
}

