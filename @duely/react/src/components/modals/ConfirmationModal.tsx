import React, { useCallback, useState } from 'react';
import { Modal, UseModalReturn } from './Modal';
import { Button } from '../buttons';
import { SkeletonParagraph } from '../skeletons';

type ConfirmationModalProps = {
  control: UseModalReturn;
  heading: React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
  confirm: (e: React.MouseEvent) => void | Promise<void>;
  cancel: (e: React.MouseEvent) => void;
  confirmText?: React.ReactNode;
  color?: 'indigo' | 'red' | 'green';
};

const iconCircleClassName = {
  indigo: 'text-indigo-600 bg-indigo-100',
  red: 'text-red-700 bg-red-100',
  green: 'text-green-600 bg-green-100'
};

export function ConfirmationModal({
  control,
  heading,
  color,
  icon,
  children,
  loading,
  confirm,
  cancel,
  confirmText
}: ConfirmationModalProps) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const confirmCallback = useCallback(
    async (e: React.MouseEvent) => {
      setConfirmLoading(true);
      await confirm(e);
      setConfirmLoading(false);
    },
    [confirm]
  );

  color = color ?? 'indigo';

  return (
    <Modal control={control}>
      <Modal.Body heading={heading} icon={icon} iconClassNames={iconCircleClassName[color]}>
        {loading && <SkeletonParagraph className="text-sm" />}
        {!loading && children}
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="button"
          onClick={confirmCallback}
          dense
          loading={confirmLoading}
          color={color}
        >
          {confirmText ?? 'Confirm'}
        </Button>
        <Button type="button" onClick={cancel} dense color="gray">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
