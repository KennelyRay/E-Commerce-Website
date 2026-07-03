'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

type ModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  onConfirm: () => void;
  onClose: () => void;
};

export function Modal({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText,
  variant = 'default',
  onConfirm,
  onClose,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const isDanger = variant === 'danger';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-100">
        <div className={`px-6 py-5 ${isDanger ? 'bg-gradient-to-r from-red-600 to-rose-600' : 'bg-gradient-to-r from-purple-600 to-pink-600'} text-white`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-black">{title}</h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-6">
          <p className="text-gray-600 leading-relaxed">{description}</p>

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            {cancelText ? (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
              >
                {cancelText}
              </button>
            ) : null}
            <button
              type="button"
              onClick={onConfirm}
              className={`px-5 py-3 rounded-2xl text-white font-bold transition-colors ${
                isDanger
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
