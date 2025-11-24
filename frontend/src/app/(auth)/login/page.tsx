'use client';

import Link from 'next/link';
import { Form } from 'antd';
import { useRouter } from 'next/navigation';
import { AntdForm, AntdFormItem, AntdInput, AntdButton, AntdAlert, useAntdNotification } from '@/components/common';
import { AntdPasswordInput } from '@/components/common/Input';
import useAuthAPI from '@/hooks/useAuthAPI';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [form] = Form.useForm<LoginFormValues>();
  const router = useRouter();
  const { contextHolder, success, error } = useAntdNotification();
  const { useLogin } = useAuthAPI();
  const loginMutation = useLogin();

  const handleSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: (data: any) => {
        success({
          message: 'Đăng nhập thành công',
          description: `Xin chào ${data?.name || ''}`,
        });
        router.push('/');
      },
      onError: (err: any) => {
        error({
          message: 'Đăng nhập thất bại',
          description: err?.response?.data?.message || 'Vui lòng kiểm tra lại thông tin',
        });
      },
    });
  };

  return (
    <>
      {contextHolder}
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Chào mừng bạn trở lại</h2>
          <p className="text-gray-500 mt-2">
            Đăng nhập để quản lý bài viết, tương tác và theo dõi cập nhật. Bạn vẫn có thể đọc bài
            public mà không cần tài khoản.
          </p>
        </div>

        <AntdAlert
          type="info"
          message="Truy cập không cần đăng nhập"
          description="Các bài viết public luôn mở cho mọi người. Chỉ cần đăng nhập khi bạn muốn tạo bài viết, lưu bài hoặc bình luận."
        />

        <AntdForm
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          title="Đăng nhập"
          description="Nhập thông tin tài khoản để tiếp tục"
        >
          <AntdFormItem
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <AntdInput placeholder="you@example.com" />
          </AntdFormItem>

          <AntdFormItem
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <AntdPasswordInput placeholder="••••••••" />
          </AntdFormItem>

          <div className="flex items-center justify-between mb-4 text-sm">
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Quên mật khẩu?
            </Link>
          </div>

          <AntdButton
            type="primary"
            htmlType="submit"
            block
            loading={loginMutation.isPending}
          >
            Đăng nhập
          </AntdButton>
        </AntdForm>

        <p className="text-center text-sm text-gray-500">
          Chưa có tài khoản?{' '}
          <Link href="/auth/register" className="text-blue-600 font-medium">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </>
  );
}

