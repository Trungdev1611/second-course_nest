import { Checkbox as AntCheckbox, CheckboxProps as AntCheckboxProps } from 'antd';
import { ReactNode } from 'react';

interface CheckboxProps extends AntCheckboxProps {
  children?: ReactNode;
  label?: string;
}

export function AntdCheckbox({ 
  children,
  label,
  ...props 
}: CheckboxProps) {
  return (
    <AntCheckbox {...props}>
      {label || children}
    </AntCheckbox>
  );
}

