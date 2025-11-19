import { Alert as AntAlert, AlertProps as AntAlertProps } from 'antd';
import { ReactNode } from 'react';

interface AlertProps extends AntAlertProps {
  children?: ReactNode;
  message: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  showIcon?: boolean;
  closable?: boolean;
  onClose?: () => void;
}

export function AntdAlert({ 
  message,
  description,
  type = 'info',
  showIcon = true,
  ...props 
}: AlertProps) {
  return (
    <AntAlert
      message={message}
      description={description}
      type={type}
      showIcon={showIcon}
      {...props}
    />
  );
}

