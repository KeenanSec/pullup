'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
export function PlanDialog({ title, onClose, children }: {
    title: string;
    onClose: () => void;
    children: ReactNode;
}) {
    const ref = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        const dialog = ref.current;
        const previous = document.activeElement as HTMLElement | null;
        dialog?.showModal();
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = overflow; dialog?.close(); previous?.focus(); };
    }, []);
    return <dialog ref={ref} className="plan-dialog" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget)
        onClose(); }}><div className="dialog-content"><div className="dialog-heading"><h2>{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={21}/></button></div>{children}</div></dialog>;
}
