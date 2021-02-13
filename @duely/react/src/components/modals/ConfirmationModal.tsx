import React from 'react';
import { Modal } from './Modal';
import { Button } from '../buttons';
import { SkeletonParagraph } from '../skeletons';

type ConfirmationModalProps = {
  show: boolean;
  heading: React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
  confirm: (e: React.MouseEvent) => void;
  cancel: (e: React.MouseEvent) => void;
  confirmClassName?: string;
  confirmText?: React.ReactNode;
};

export function ConfirmationModal({ show, heading, icon, children, loading, confirm, cancel, confirmClassName, confirmText }: ConfirmationModalProps) {
  return (
    <Modal show={show} className="max-w-lg rounded-lg">
      <div className="flex p-6 space-x-4 bg-white rounded-t-lg">
        {icon && (
          <div className="grid w-10 h-10 text-xl rounded-full place-items-center">
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
          onClick={confirm}
          dense
          loading={loading}
          spinner
          className={confirmClassName ?? 'bg-indigo-600 hover:bg-indigo-700'}
        >
          { confirmText ?? 'Confirm' }
        </Button>
        <Button
          type="button"
          onClick={cancel}
          dense
          className="text-gray-600 border-gray-300 bg-gray-50 hover:bg-gray-100"
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
