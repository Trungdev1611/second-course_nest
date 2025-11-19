import { Modal as AntModal, ModalProps as AntModalProps } from 'antd';
import { ReactNode } from 'react';
import { useUIStore } from '@/store/uiStore';

interface ModalProps extends Omit<AntModalProps, 'open' | 'onCancel'> {
  children: ReactNode;
  open?: boolean;
  onClose?: () => void;
}

export function AntdModal({ 
  children, 
  open, 
  onClose,
  ...props 
}: ModalProps) {
  const { modalOpen, closeModal } = useUIStore();
  const isOpen = open !== undefined ? open : modalOpen;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      closeModal();
    }
  };

  return (
    <AntModal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      {...props}
    >
      {children}
    </AntModal>
  );
}

