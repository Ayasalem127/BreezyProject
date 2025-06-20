import ChatList from "@/components/ChatList";

export default function Home() {
  return (
    <div className="w-full px-2 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 p-10">Mes conversations</h1>
        <ChatList />
    </div>
  );
}