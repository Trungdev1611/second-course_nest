'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Form } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { AntdForm, AntdFormItem, AntdButton, AntdAlert, AntdPasswordInput, useAntdNotification, AntdInput } from '@/components/common';
import { authApi } from '@/lib/api';

interface ResetPasswordFormValues {
  email: string;
  password: string;
}

export default function ResetPasswordPage() {
  const [form] = Form.useForm<ResetPasswordFormValues>();
  const params = useSearchParams();
  const token = params.get('token');
  const { contextHolder, success, error } = useAntdNotification();

  const mutation = useMutation({
    mutationFn: (values: ResetPasswordFormValues) =>
      authApi.resetPassword(values, token || ''),
    onSuccess: () => {
      success({
        message: 'Đặt lại mật khẩu thành công',
        description: 'Bạn có thể đăng nhập với mật khẩu mới.',
      });
    },
    onError: () => {
      error({
        message: 'Không thể đặt lại mật khẩu',
        description: 'Token không hợp lệ hoặc đã hết hạn.',
      });
    },
  });

  return (
    <>
      {contextHolder}
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-900">Đặt lại mật khẩu</h2>
        <AntdAlert
          type="info"
          message="Token xác minh"
          description="Đường dẫn này chỉ dành cho người đã nhận được email reset. Bạn vẫn xem bài public mà không cần tài khoản."
        />
        <AntdForm
          form={form}
          layout="vertical"
          onFinish={(values) => mutation.mutate(values)}
        >
          <AntdFormItem
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Nhập email đã đăng ký' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <AntdInput placeholder="you@example.com" />
          </AntdFormItem>
          <AntdFormItem
            label="Mật khẩu mới"
            name="password"
            rules={[{ required: true, message: 'Nhập mật khẩu mới' }]}
          >
            <AntdPasswordInput placeholder="Mật khẩu mới" />
          </AntdFormItem>
          <AntdButton
            type="primary"
            htmlType="submit"
            block
            loading={mutation.isPending}
            disabled={!token}
          >
            Cập nhật mật khẩu
          </AntdButton>
        </AntdForm>
        <p className="text-center text-sm">
          <Link href="/login" className="text-blue-600">
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </>
  );
}

