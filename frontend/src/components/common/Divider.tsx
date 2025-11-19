import { Divider as AntDivider, DividerProps as AntDividerProps } from 'antd';
import { ReactNode } from 'react';

interface DividerProps extends AntDividerProps {
  children?: ReactNode;
  orientation?: 'left' | 'right' | 'center';
  dashed?: boolean;
  plain?: boolean;
}

export function AntdDivider({ 
  children,
  orientation = 'center',
  ...props 
}: DividerProps) {
  return (
    <AntDivider orientation={orientation} {...props}>
      {children}
    </AntDivider>
  );
}

