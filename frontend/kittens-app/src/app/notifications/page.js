import NotificationsMobile from "@/components/NotificationsMobile";

export default function Home() {
  return (
    <div className="w-full px-2 text-center">
      <h1>Notifications</h1>
      {/* Affiché uniquement sur mobile */}
      <div className="block sm:hidden">
        <NotificationsMobile />
      </div>
    </div>
  );
}