import { Input as AntInput } from 'antd';
import type { InputProps as AntInputProps, TextAreaProps as AntTextAreaProps } from 'antd/es/input';

interface BaseFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
}

interface InputProps extends AntInputProps, BaseFieldProps {}

export function AntdInput({ label, error, helperText, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <AntInput
        {...props}
        status={error ? 'error' : undefined}
        className="w-full"
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

interface TextAreaProps extends AntTextAreaProps, BaseFieldProps {}

const { TextArea: AntTextArea } = AntInput;

export function AntdTextArea({ label, error, helperText, ...props }: TextAreaProps) {
  
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <AntTextArea
        {...props}
        status={error ? 'error' : undefined}
        className="w-full"
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

