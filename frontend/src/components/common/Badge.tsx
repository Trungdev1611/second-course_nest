import { Badge as AntBadge, BadgeProps as AntBadgeProps } from 'antd';
import { ReactNode } from 'react';

interface BadgeProps extends AntBadgeProps {
  children?: ReactNode;
  count?: number;
  showZero?: boolean;
  variant?: 'default' | 'dot' | 'count';
}

export function AntdBadge({ 
  children, 
  count, 
  showZero = false,
  variant = 'count',
  ...props 
}: BadgeProps) {
  if (variant === 'dot') {
    return <AntBadge dot {...props}>{children}</AntBadge>;
  }

  return (
    <AntBadge count={count} showZero={showZero} {...props}>
      {children}
    </AntBadge>
  );
}

