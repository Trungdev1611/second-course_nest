'use client';

import { ReactNode } from 'react';
import { Form, FormProps, FormItemProps } from 'antd';

interface AntdFormProps extends FormProps {
  title?: string;
  description?: string;
  children: ReactNode;
  withShadow?: boolean;
  wrapperClassName?: string;
}

export function AntdForm({
  title,
  description,
  children,
  withShadow = true,
  layout = 'vertical',
  wrapperClassName = '',
  ...props
}: AntdFormProps) {
  return (
    <div className={`rounded-2xl bg-white ${withShadow ? 'shadow-md' : ''} p-6 ${wrapperClassName}`}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      )}
      <Form layout={layout} {...props}>
        {children}
      </Form>
    </div>
  );
}

export function AntdFormItem(props: FormItemProps) {
  return <Form.Item {...props} />;
}

