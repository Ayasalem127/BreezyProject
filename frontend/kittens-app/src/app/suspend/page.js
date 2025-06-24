"use client"
import Searchbar from "@/components/Searchbar";
import Subscriptions from "@/components/Subscriptions";
import Suspend from "@/components/Suspend";
import UsersSuggestionMobile from "@/components/UsersSuggestionMobile";


import { useState } from "react";


export default function Home() {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="w-full px-2 text-center">

        <h1>Utilisateurs</h1>

      
      <Searchbar searchText={searchText} setSearchText={setSearchText} />
      
      <Suspend searchText={searchText} />


      <div className="block sm:hidden mt-10">
        <UsersSuggestionMobile />
      </div>
    </div>
  );
}

