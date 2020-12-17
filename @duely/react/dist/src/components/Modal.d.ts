import React from 'react';
declare type ModalProps = {
    children: React.ReactNode;
    show: boolean;
    close?: () => void;
    openerRef?: React.RefObject<Node>;
    className?: string;
};
export declare function Modal({ children, show, close, openerRef, className }: ModalProps): React.ReactPortal | null;
export {};
