import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}

export default function Modal({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/50"></div>

      <div
        className={`bg-white rounded-lg p-6 max-w-md w-full shadow-lg transform transition-transform duration-300 z-10 ${
          isOpen ? 'scale-100' : 'scale-95'
        }`}
      >
        <h2 className="text-xl font-semibold">{title}</h2>
        {children}
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#e01e5a] font-bold text-white rounded-lg hover:bg-[#d0174d]"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
