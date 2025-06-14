'use client';

export default function PopupEmptyFields({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full relative animate-fade-in">
        <h2 className="text-xl font-semibold mb-4">Champs requis</h2>
        <p className="text-gray-700 mb-4">
          Un ou plusieurs champs sont vides. Tous les champs sont requis.
        </p>
        <button onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
}
