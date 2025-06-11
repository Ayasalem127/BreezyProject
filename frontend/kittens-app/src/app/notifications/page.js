import Notifications from "@/components/Notifications";

export default function Home() {
  return (
    <div className="w-full px-2 text-center">
        <img src="/logo.webp" alt="logo" className="fixed top-2 right-2 w-10 h-10 object-contain mb-2" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4 p-10">Notifications</h1>
        <Notifications />
    </div>
  );
}