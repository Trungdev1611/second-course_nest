import { Tag as AntTag, TagProps as AntTagProps } from 'antd';
import { ReactNode } from 'react';

interface TagProps extends AntTagProps {
  children: ReactNode;
  color?: string;
  closable?: boolean;
  onClose?: () => void;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const variantColors = {
  default: 'default',
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'processing',
};

export function AntdTag({ 
  children, 
  color,
  variant = 'default',
  ...props 
}: TagProps) {
  const tagColor = color || variantColors[variant];

  return (
    <AntTag color={tagColor} {...props}>
      {children}
    </AntTag>
  );
}

