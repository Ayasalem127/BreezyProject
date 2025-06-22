'use client';

export default function NotificationsMobile() {
    const notifications = ["Description", "Description", "Description", "Description", "Description", "Description", "Description", "Description", "Description", "Description"];

    function remove(index) {
        console.log(`Notification ${index} supprimée.`)
    }

    return (
        <div className="flex flex-col items-center w-full px-4">
            {notifications.map((notification, index) => (
            <div key={index} style={{ boxShadow: "0 12px 32px var(--shadow-color)", borderColor: 'var(--input-border)' }} className="w-full sm:w-[calc(50%-0.5rem)] p-2 m-4 box-border flex flex-col justify-between border rounded-2xl">
                <div className="flex items-center gap-3 w-full">
                    <span id={`notification-${index}`} rows={3} className="mt-1 block w-full rounded-md p-2 focus:border-blue-500 focus:outline-none">{notification}</span>
                    <span id={`deleteButton-${index}`} className="text-l cursor-pointer" onClick={() => remove(index)} role="button" aria-label="delete button">❌</span>
                </div>
            </div>
            ))}
            
        </div>
    );
}