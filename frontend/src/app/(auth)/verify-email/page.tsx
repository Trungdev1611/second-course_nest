'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Spin, Result, Button, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, MailOutlined } from '@ant-design/icons';
import useAuthAPI from '@/hooks/useAuthAPI';
import { useAntdNotification } from '@/components/common';

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const { contextHolder, success, error: showError } = useAntdNotification();
  const { useVerifyEmail } = useAuthAPI();
  const verifyMutation = useVerifyEmail();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token không hợp lệ. Vui lòng kiểm tra lại link trong email.');
      return;
    }

    // Tự động gọi API verify khi page load
    verifyMutation.mutate(token, {
      onSuccess: (data: any) => {
        setStatus('success');
        setMessage(data?.message || 'Email đã được xác nhận thành công!');
        success({
          message: 'Xác nhận email thành công',
          description: 'Bạn có thể đăng nhập ngay bây giờ.',
        });
        
        // ⭐ THÔNG BÁO CHO CÁC TAB KHÁC BIẾT ĐÃ VERIFY
        // Cách 1: localStorage event (tương thích tốt)
        if (typeof window !== 'undefined') {
          localStorage.setItem('email_verified', Date.now().toString());
          localStorage.removeItem('email_verified'); // Trigger event
          
          // Cách 2: BroadcastChannel (modern, tốt hơn)
          try {
            const channel = new BroadcastChannel('email-verification');
            channel.postMessage({ type: 'email_verified', timestamp: Date.now() });
            channel.close();
          } catch (e) {
            // Fallback nếu browser không support
            console.log('BroadcastChannel not supported');
          }
        }
        
        // Redirect về home
        setTimeout(() => {
          router.push('/');
        }, 2000);
      },
      onError: (err: any) => {
        setStatus('error');
        setMessage(
          err?.response?.data?.message || 
          'Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại email xác nhận.'
        );
        showError({
          message: 'Xác nhận email thất bại',
          description: err?.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn.',
        });
      },
    });
  }, [token]);

  return (
    <>
      {contextHolder}
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          {status === 'loading' && (
            <div className="text-center space-y-4">
              <Spin size="large" />
              <p className="text-gray-600">Đang xác nhận email...</p>
            </div>
          )}

          {status === 'success' && (
            <Result
              status="success"
              icon={<CheckCircleOutlined className="text-green-500" />}
              title="Xác nhận email thành công!"
              subTitle={message}
              extra={[
                <Button key="home" onClick={() => router.push('/')}>
                  Về trang chủ
                </Button>,
              ]}
            />
          )}

          {status === 'error' && (
            <Result
              status="error"
              icon={<CloseCircleOutlined className="text-red-500" />}
              title="Xác nhận email thất bại"
              subTitle={message}
              extra={[
                <Space key="actions" direction="vertical" className="w-full">
                  <Button
                    type="primary"
                    icon={<MailOutlined />}
                    onClick={() => router.push('/login')}
                    block
                  >
                    Đăng nhập để gửi lại email
                  </Button>
                  <Button onClick={() => router.push('/')} block>
                    Về trang chủ
                  </Button>
                </Space>,
              ]}
            />
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            <Link href="/login" className="text-blue-600 hover:underline">
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

