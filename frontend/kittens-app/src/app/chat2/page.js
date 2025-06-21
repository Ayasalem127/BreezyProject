import InputBar from "@/components/InputBar";
import Chat from "@/components/Chat";

export default function Home() {
  return (
    <div className="w-full px-2 text-center">
        <Chat />
        <InputBar />
    </div>
  );
}