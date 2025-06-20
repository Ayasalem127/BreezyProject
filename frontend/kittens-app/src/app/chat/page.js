import InputBar from "@/components/ImputBar";
import Chat from "@/components/Chat";

export default function Home() {
  return (
    <div className="w-full px-2 text-center">
        <Chat />
        <InputBar />
    </div>
  );
}