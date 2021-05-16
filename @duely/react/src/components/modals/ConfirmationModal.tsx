import React, { useCallback, useState } from 'react';
import { Modal } from './Modal';
import { Button } from '../buttons';
import { SkeletonParagraph } from '../skeletons';

type ConfirmationModalProps = {
  show: boolean;
  heading: React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
  confirm: (e: React.MouseEvent) => void | Promise<void>;
  cancel: (e: React.MouseEvent) => void;
  confirmText?: React.ReactNode;
  color?: 'indigo' | 'red' | 'green'
};

const iconCircleClassName = {
  indigo: 'text-indigo-600 bg-indigo-100',
  red: 'text-red-700 bg-red-100', 
  green: 'text-green-600 bg-green-100'
}

export function ConfirmationModal({ show, heading, color, icon, children, loading, confirm, cancel, confirmText }: ConfirmationModalProps) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const confirmCallback = useCallback(async (e: React.MouseEvent) => {
    setConfirmLoading(true);
    await confirm(e);
    setConfirmLoading(false);
  }, [confirm]);

  color = color ?? 'indigo';
  
  return (
    <Modal show={show} className="max-w-lg rounded-lg">
      <div className="flex p-6 space-x-4 bg-white rounded-t-lg">
        {icon && (
          <div className={`grid w-10 h-10 text-xl rounded-full place-items-center ${iconCircleClassName[color]}`}>
            {icon}
          </div>
        )}

        <div className="flex flex-col flex-1 space-y-4 w-96 min-w-min">
          <h3 className="text-xl font-medium">{heading}</h3>

          {loading && <SkeletonParagraph className="text-sm" />}

          {!loading && children }
        </div>
      </div>
      <div className="flex flex-row-reverse px-6 py-4 space-x-4 space-x-reverse text-sm font-medium text-white rounded-b-lg bg-gray-50">
        <Button
          type="button"
          onClick={confirmCallback}
          dense
          loading={confirmLoading}
          color={color}
        >
          { confirmText ?? 'Confirm' }
        </Button>
        <Button
          type="button"
          onClick={cancel}
          dense
          color="gray"
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
