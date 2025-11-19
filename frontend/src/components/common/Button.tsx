import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';
import { ReactNode } from 'react';

interface ButtonProps extends AntButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
  size?: 'small' | 'medium' | 'large';
}

export function AntdButton({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  ...props 
}: ButtonProps) {
  const getVariantProps = () => {
    switch (variant) {
      case 'primary':
        return { type: 'primary' as const };
      case 'secondary':
        return { type: 'default' as const };
      case 'danger':
        return { type: 'primary' as const, danger: true };
      case 'ghost':
        return { type: 'default' as const, ghost: true };
      case 'link':
        return { type: 'link' as const };
      default:
        return { type: 'primary' as const };
    }
  };

  const getSizeProps = () => {
    switch (size) {
      case 'small':
        return { size: 'small' as const };
      case 'medium':
        return { size: 'middle' as const };
      case 'large':
        return { size: 'large' as const };
      default:
        return { size: 'middle' as const };
    }
  };

  return (
    <AntButton {...getVariantProps()} {...getSizeProps()} {...props}>
      {children}
    </AntButton>
  );
}

