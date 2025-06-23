import ChatList from "@/components/ChatList";

export default function Home() {
  return (
    <div className="w-full px-2 text-center">
        <h1>Mes conversations</h1>
        <ChatList />
    </div>
  );
}