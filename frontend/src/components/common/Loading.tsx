import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  fullScreen?: boolean;
}

export function AntdLoading({ 
  size = 'default', 
  tip = 'Đang tải...',
  fullScreen = false 
}: LoadingProps) {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <Spin size={size} tip={tip} indicator={antIcon} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <Spin size={size} tip={tip} indicator={antIcon} />
    </div>
  );
}

