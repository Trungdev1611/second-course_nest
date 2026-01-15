'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Form } from 'antd';
import { useRouter } from 'next/navigation';
import { AntdForm, AntdFormItem, AntdInput, AntdButton, AntdAlert, useAntdNotification } from '@/components/common';
import { AntdPasswordInput } from '@/components/common/Input';
import useAuthAPI from '@/hooks/useAuthAPI';
import { VerifyEmailModal } from '@/components/auth/VerifyEmailModal';
import { useAuthStore } from '@/store/authStore';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [form] = Form.useForm<LoginFormValues>();
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();
  const { contextHolder, success, error } = useAntdNotification();
  const { useLogin, useGetMe } = useAuthAPI();
  const loginMutation = useLogin();
  const { user, setUser } = useAuthStore();
  const { data: meData, refetch: refetchMe } = useGetMe();

  // ⭐ LẮNG NGHE EMAIL VERIFIED TỪ TAB KHÁC
  useEffect(() => {
    // Cách 1: BroadcastChannel (modern, tốt hơn)
    let channel: BroadcastChannel | null = null;
    
    try {
      channel = new BroadcastChannel('email-verification');
      channel.onmessage = (event) => {
        if (event.data.type === 'email_verified') {
          // Email đã được verify ở tab khác
          success({
            message: 'Email đã được xác nhận',
            description: 'Bạn có thể đăng nhập ngay bây giờ.',
          });
          
          // Đóng modal nếu đang mở
          setShowVerifyModal(false);
          
          // Refetch user data để cập nhật is_verify_email
          if (user?.email) {
            router.push('/');
          }
        }
      };
    } catch (e) {
      console.log('BroadcastChannel not supported, using localStorage fallback');
    }

    // Cách 2: localStorage event (fallback)
    const handleStorageChange = (e: StorageEvent) => {
      // Khi email được verify, tab verify sẽ trigger storage event
      if (e.key === 'email_verified' || e.newValue) {
        // Check lại user data
        if (user?.email) {
          router.push('/');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      if (channel) {
        channel.close();
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user?.email, refetchMe, success]);

  // ⭐ KIỂM TRA KHI USER DATA THAY ĐỔI
  useEffect(() => {
    if (meData && meData.is_verify_email === true && showVerifyModal) {
      // User đã verify → đóng modal
      setShowVerifyModal(false);
      success({
        message: 'Email đã được xác nhận',
        description: 'Bạn có thể tiếp tục sử dụng tài khoản.',
      });
    }
  }, [meData, showVerifyModal, success]);

  const handleSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: (data: any) => {
        // Kiểm tra xem email đã được verify chưa
        if (data?.is_verify_email === false || data?.is_verify_email === undefined) {
          // Chưa verify → hiển thị modal yêu cầu verify
          setUserEmail(data?.email || values.email);
          setShowVerifyModal(true);
        } else {
          // Đã verify → đăng nhập thành công
          success({
            message: 'Đăng nhập thành công',
            description: `Xin chào ${data?.name || ''}`,
          });
          router.push('/');
        }
      },
      onError: (err: any) => {
        error({
          message: 'Đăng nhập thất bại',
          description: err?.response?.data?.message || 'Vui lòng kiểm tra lại thông tin',
        });
      },
    });
  };

  const handleVerified = () => {
    setShowVerifyModal(false);
    success({
      message: 'Email đã được xác nhận',
      description: 'Bạn có thể đăng nhập lại hoặc tiếp tục sử dụng tài khoản.',
    });
    // Refresh page để load lại user data
    window.location.reload();
  };

  return (
    <>
      {contextHolder}
      <VerifyEmailModal
        open={showVerifyModal}
        userEmail={userEmail}
        onClose={() => setShowVerifyModal(false)}
        onVerified={handleVerified}
      />
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
          <Link href="/register" className="text-blue-600 font-medium">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </>
  );
}

