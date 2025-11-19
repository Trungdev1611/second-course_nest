import { Radio as AntRadio, RadioGroupProps as AntRadioGroupProps } from 'antd';
import { ReactNode } from 'react';

export interface RadioProps {
  children?: ReactNode;
  value: string | number;
}

export interface RadioGroupPropsExtended extends AntRadioGroupProps {
  options?: { label: string; value: string | number }[];
  label?: string;
  error?: string;
}

export function AntdRadio({ children, value, ...props }: RadioProps) {
  return <AntRadio value={value} {...props}>{children}</AntRadio>;
}

export function AntdRadioGroup({ 
  label, 
  error,
  options,
  ...props 
}: RadioGroupPropsExtended) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <AntRadio.Group
        {...props}
        options={options}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}