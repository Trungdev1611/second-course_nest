import { Table, TableProps } from 'antd';
import { ReactNode } from 'react';

interface AntdTableProps<RecordType> extends TableProps<RecordType> {
  title?: string;
  description?: string;
  extra?: ReactNode;
  wrapperClassName?: string;
}

export function AntdTable<RecordType extends object = any>({
  title,
  description,
  extra,
  wrapperClassName = '',
  ...props
}: AntdTableProps<RecordType>) {
  return (
    <div className={`rounded-2xl bg-white shadow-md p-4 ${wrapperClassName}`}>
      {(title || description || extra) && (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
          {extra}
        </div>
      )}
      <Table<RecordType>
        {...props}
        className="antd-table-custom"
        scroll={{ x: true, ...(props.scroll || {}) }}
      />
    </div>
  );
}

