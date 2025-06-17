import Searchbar from "@/components/Searchbar";
import Subscriptions from "@/components/Subscriptions";
import UsersSuggestionMobile from "@/components/UsersSuggestionMobile";

export default function Home() {
  return (
    <div className="w-full px-2 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 p-10">Utilisateurs</h1>
        <Searchbar />
        <Subscriptions />

        <div className="block sm:hidden mt-10">
          <UsersSuggestionMobile />
        </div>
    </div>
  );
}