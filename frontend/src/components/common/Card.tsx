import { Card as AntCard, CardProps as AntCardProps } from 'antd';
import { ReactNode } from 'react';

interface CardProps extends AntCardProps {
  children: ReactNode;
  title?: string | ReactNode;
  extra?: ReactNode;
  hoverable?: boolean;
  bordered?: boolean;
  description?: string
}

export function AntdCard({ 
  children, 
  title, 
  extra, 
  hoverable = false,
  bordered = true,
  ...props 
}: CardProps) {
  return (
    <AntCard
      title={title}
      extra={extra}
      hoverable={hoverable}
      bordered={bordered}
      {...props}
    >
      {children}
    </AntCard>
  );
}

