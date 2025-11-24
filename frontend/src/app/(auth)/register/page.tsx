'use client';

import Link from 'next/link';
import { Form } from 'antd';
import { useRouter } from 'next/navigation';
import { AntdForm, AntdFormItem, AntdInput, AntdButton, AntdAlert, useAntdNotification } from '@/components/common';
import { AntdPasswordInput } from '@/components/common/Input';
import useAuthAPI from '@/hooks/useAuthAPI';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const [form] = Form.useForm<RegisterFormValues>();
  const router = useRouter();
  const { contextHolder, success, error } = useAntdNotification();
  const { useRegister } = useAuthAPI();
  const registerMutation = useRegister();

  const handleSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        success({
          message: 'Đăng ký thành công',
          description: 'Vui lòng kiểm tra email để xác nhận tài khoản.',
        });
        router.push('/login');
      },
      onError: (err: any) => {
        error({
          message: 'Đăng ký thất bại',
          description: err?.response?.data?.message || 'Vui lòng thử lại sau',
        });
      },
    });
  };

  return (
    <>
      {contextHolder}
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Tạo tài khoản mới</h2>
          <p className="text-gray-500 mt-2">
            Đăng ký để đăng bài, lưu bài viết yêu thích và theo dõi tác giả. Vẫn có thể đọc các bài
            public mà không cần tài khoản.
          </p>
        </div>

        <AntdAlert
          type="success"
          message="Quyền lợi thành viên"
          description="Đăng bài viết, bình luận, nhận thông báo cá nhân và lưu các bài yêu thích."
        />

        <AntdForm
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          title="Đăng ký"
          description="Chỉ mất vài giây để trở thành thành viên"
        >
          <AntdFormItem
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <AntdInput placeholder="Nguyễn Văn A" />
          </AntdFormItem>

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
            <AntdPasswordInput placeholder="Tối thiểu 6 ký tự" />
          </AntdFormItem>

          <AntdButton
            type="primary"
            htmlType="submit"
            block
            loading={registerMutation.isPending}
          >
            Đăng ký
          </AntdButton>
        </AntdForm>

        <p className="text-center text-sm text-gray-500">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-blue-600 font-medium">
            Đăng nhập
          </Link>
        </p>
      </div>
    </>
  );
}

