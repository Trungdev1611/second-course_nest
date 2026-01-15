'use client';

import { useState } from 'react';
import { Modal, Form, Input, Button, Alert, Space } from 'antd';
import { MailOutlined, CheckCircleOutlined } from '@ant-design/icons';
import useAuthAPI from '@/hooks/useAuthAPI';
import { useAntdNotification } from '@/components/common';

interface VerifyEmailModalProps {
  open: boolean;
  userEmail: string;
  onClose: () => void;
  onVerified: () => void;
}

export function VerifyEmailModal({ open, userEmail, onClose, onVerified }: VerifyEmailModalProps) {
  const [form] = Form.useForm();
  const [emailSent, setEmailSent] = useState(false);
  const { contextHolder, success, error } = useAntdNotification();
  const { useSendVerificationEmail } = useAuthAPI();
  const sendEmailMutation = useSendVerificationEmail();

  const handleSendEmail = async (values: { email: string }) => {
    try {
      await sendEmailMutation.mutateAsync({ email: values.email });
      setEmailSent(true);
      success({
        message: 'Email đã được gửi',
        description: 'Vui lòng kiểm tra hộp thư và click vào link để xác nhận email.',
      });
    } catch (err: any) {
      error({
        message: 'Gửi email thất bại',
        description: err?.response?.data?.message || 'Vui lòng thử lại sau',
      });
    }
  };

  const handleClose = () => {
    form.resetFields();
    setEmailSent(false);
    onClose();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <Space>
            <MailOutlined />
            <span>Xác nhận Email</span>
          </Space>
        }
        open={open}
        onCancel={handleClose}
        footer={null}
        width={500}
        closable={!emailSent}
        maskClosable={!emailSent}
      >
        <div className="space-y-4 mt-4">
          {!emailSent ? (
            <>
              <Alert
                message="Email chưa được xác nhận"
                description="Vui lòng xác nhận email để tiếp tục sử dụng tài khoản. Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn."
                type="warning"
                showIcon
                className="mb-4"
              />

              <Form
                form={form}
                onFinish={handleSendEmail}
                layout="vertical"
                initialValues={{ email: userEmail }}
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email' },
                    { type: 'email', message: 'Email không hợp lệ' },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="you@example.com"
                    disabled={sendEmailMutation.isPending}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={sendEmailMutation.isPending}
                    icon={<MailOutlined />}
                  >
                    Gửi lại email xác nhận
                  </Button>
                </Form.Item>
              </Form>

              <div className="text-sm text-gray-500 text-center">
                <p>Không nhận được email?</p>
                <p>Kiểm tra thư mục spam hoặc nhập email khác để gửi lại.</p>
              </div>
            </>
          ) : (
            <>
              <Alert
                message="Email đã được gửi thành công!"
                description={
                  <div className="mt-2">
                    <p>Chúng tôi đã gửi email xác nhận đến:</p>
                    <p className="font-semibold">{form.getFieldValue('email')}</p>
                    <p className="mt-2">Vui lòng:</p>
                    <ol className="list-decimal list-inside mt-1 space-y-1">
                      <li>Kiểm tra hộp thư đến (và cả thư mục spam)</li>
                      <li>Click vào link xác nhận trong email</li>
                      <li>Quay lại đăng nhập sau khi xác nhận xong</li>
                    </ol>
                  </div>
                }
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
                className="mb-4"
              />

              <Button
                type="default"
                block
                onClick={handleClose}
              >
                Đã hiểu
              </Button>

              <div className="text-center mt-4">
                <Button
                  type="link"
                  onClick={() => {
                    setEmailSent(false);
                    form.resetFields();
                  }}
                >
                  Gửi lại email khác
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}

