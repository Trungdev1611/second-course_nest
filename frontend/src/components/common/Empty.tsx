import { Empty as AntEmpty, EmptyProps as AntEmptyProps } from 'antd';
import { ReactNode } from 'react';

interface EmptyProps extends AntEmptyProps {
  description?: string | ReactNode;
  image?: ReactNode;
}

export function AntdEmpty({ 
  description = 'Không có dữ liệu',
  ...props 
}: EmptyProps) {
  return (
    <AntEmpty
      description={description}
      {...props}
    />
  );
}

