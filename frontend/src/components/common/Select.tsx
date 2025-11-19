import { Select as AntSelect, SelectProps as AntSelectProps } from 'antd';
import { ReactNode } from 'react';

interface SelectProps extends AntSelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: { label: string; value: string | number }[];
}

export function AntdSelect({ 
  label, 
  error, 
  helperText,
  options,
  ...props 
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <AntSelect
        {...props}
        status={error ? 'error' : undefined}
        className="w-full"
        options={options}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

