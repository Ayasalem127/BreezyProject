import InputBar from "@/components/InputBar";
import Chat from "@/components/Chat";

export default function Home({ params }) {
    const { userId } = params;

    return (
        <div className="w-full px-2 text-center">
            <Chat userId={userId}/>
            <InputBar userId={userId}/>
        </div>
    );
}