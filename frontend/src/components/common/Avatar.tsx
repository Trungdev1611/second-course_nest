import { Avatar as AntAvatar, AvatarProps as AntAvatarProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface AvatarProps extends AntAvatarProps {
  src?: string;
  alt?: string;
  size?: number | 'small' | 'large' | 'default';
  name?: string;
}

export function AntdAvatar({ 
  src, 
  alt, 
  size = 'default',
  name,
  ...props 
}: AvatarProps) {
  // Get initials from name
  const getInitials = (name?: string) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <AntAvatar
      src={src}
      alt={alt}
      size={size}
      icon={!src && !name ? <UserOutlined /> : undefined}
      {...props}
    >
      {!src && name ? getInitials(name) : undefined}
    </AntAvatar>
  );
}

