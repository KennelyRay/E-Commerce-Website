'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useDialog } from '@/hooks/useDialog';

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
  const dialogRef = useDialog<HTMLDivElement>(isOpen, onClose);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <div className="absolute inset-0 animate-fade-in bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className="relative w-full max-w-md animate-pop-in rounded-card bg-surface p-6 shadow-overlay"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="modal-title" className="text-lg font-bold">
            {title}
          </h2>
          <button type="button" onClick={onClose} className="icon-btn -mr-2 -mt-2" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p id="modal-description" className="mt-2 text-muted">
          {description}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {cancelText ? (
            <button type="button" onClick={onClose} className="btn-outline">
              {cancelText}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onConfirm}
            data-autofocus
            className={variant === 'danger' ? 'btn bg-danger text-white hover:bg-danger/90 dark:text-bg' : 'btn-dark'}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
