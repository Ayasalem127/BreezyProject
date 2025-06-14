'use client';

export default function NotificationsPC() {
    const notifications = ["Description", "Description", "Description", "Description", "Description", "Description", "Description", "Description", "Description", "Description"];

    function remove(index) {
        console.log(`Notification ${index} supprimée.`)
    }

    return (
        <div className="flex flex-col fixed top-12 left-0 items-end w-full overflow-y-auto" style={{ maxHeight: 'calc(100vh - var(--navbar-height))' }}>
            <div className="bg-white w-1/4 p-2 rounded-xl">
                {notifications.map((notification, index) => (
                <div key={index} className="w-full p-2 mt-4 box-border flex flex-col justify-between border rounded-lg">
                    <div className="flex items-center gap-3 w-full">
                        <span id={`notification-${index}`} rows={3} className="mt-1 block w-full rounded-md p-2 focus:border-blue-500 focus:outline-none">{notification}</span>
                        <span id={`deleteButton-${index}`} className="text-l cursor-pointer" onClick={() => remove(index)} role="button" aria-label="delete button">❌</span>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}