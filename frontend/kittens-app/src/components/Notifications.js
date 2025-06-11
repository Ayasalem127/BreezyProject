'use client';

export default function Notifications() {
    const notifications = ["Description", "Description", "Description", "Description", "Description", "Description", "Description", "Description", "Description", "Description"];

    function remove(index) {
        console.log(`Notification ${index} supprimée.`)
    }

    return (
        <div className="flex flex-wrap w-full gap-4">
            {notifications.map((notification, index) => (
            <div key={index} className="w-full sm:w-[calc(50%-0.5rem)] p-2 mt-4 box-border flex flex-col justify-between border rounded-lg">
                <div className="flex items-center gap-3 w-full">
                    <textarea readOnly id={`notification-${index}`} value={notification} rows={3} className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"/>
                    <span id={`deleteButton-${index}`} className="text-3xl cursor-pointer" onClick={() => remove(index)} role="button" aria-label="delete button">❌</span>
                </div>
            </div>
            ))}
            
        </div>
    );
}