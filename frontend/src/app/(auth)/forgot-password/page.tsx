'use client';

import Link from 'next/link';
import { Form } from 'antd';
import { AntdForm, AntdFormItem, AntdInput, AntdButton, AntdAlert, useAntdNotification } from '@/components/common';
import { authApi } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';

interface ForgotPasswordFormValues {
  email: string;
}

export default function ForgotPasswordPage() {
  const [form] = Form.useForm<ForgotPasswordFormValues>();
  const { contextHolder, success, error } = useAntdNotification();

  const mutation = useMutation({
    mutationFn: (values: ForgotPasswordFormValues) => authApi.forgotPassword(values),
    onSuccess: () => {
      success({
        message: 'Đã gửi email đặt lại mật khẩu',
        description: 'Vui lòng kiểm tra hộp thư của bạn.',
      });
    },
    onError: () => {
      error({
        message: 'Không thể gửi email',
        description: 'Vui lòng kiểm tra lại email hoặc thử lại sau.',
      });
    },
  });

  return (
    <>
      {contextHolder}
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-900">Quên mật khẩu</h2>
        <AntdAlert
          type="info"
          message="Vẫn đọc được bài viết public"
          description="Không cần đăng nhập để truy cập các bài public. Chỉ khi muốn tạo/sửa bài mới cần đặt lại mật khẩu."
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
          <AntdButton
            type="primary"
            htmlType="submit"
            block
            loading={mutation.isPending}
          >
            Gửi link đặt lại mật khẩu
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

