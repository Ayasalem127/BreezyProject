import ChatList from "@/components/ChatList";
import ChatSearchbar from "@/components/ChatSearchbar";

export default function Home() {
  return (
    <div className="w-full px-2 text-center">
        <h1>Mes conversations</h1>
        <ChatSearchbar />
        <ChatList />
    </div>
  );
}