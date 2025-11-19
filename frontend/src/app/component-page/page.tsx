'use client';

import { useState } from 'react';
import { Space, Row, Col, Typography, Form } from 'antd';
import dayjs from 'dayjs';
import {
  AntdButton,
  AntdInput,
  AntdTextArea,
  AntdCard,
  AntdModal,
  AntdBadge,
  AntdAvatar,
  AntdTag,
  AntdLoading,
  AntdEmpty,
  AntdAlert,
  AntdDivider,
  AntdSelect,
  AntdCheckbox,
  AntdRadioGroup,
  AntdEditor,
  AntdForm,
  AntdFormItem,
  AntdTable,
  useAntdNotification,
  AntdNotificationPopover,
  AntdChat,
} from '@/components/common';
import type { NotificationItem } from '@/components/common/NotificationPopover';
import { useUIStore } from '@/store/uiStore';
import { 
  UserOutlined, 
  HeartOutlined, 
  MessageOutlined,
  EyeOutlined,
  ShareAltOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function ComponentsDemoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editorValue, setEditorValue] = useState('<p>Share your thoughts...</p>');
  const { theme, setTheme } = useUIStore();
  const [form] = Form.useForm();
  const { contextHolder, success, info } = useAntdNotification();
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Bài viết mới được duyệt',
      description: '“Mastering NestJS Guards” đã được phê duyệt.',
      time: new Date(),
      status: 'success',
      unread: true,
    },
    {
      id: '2',
      title: 'Bình luận mới',
      description: 'Có người vừa bình luận vào bài viết của bạn.',
      time: dayjs().subtract(2, 'hour').toDate(),
      status: 'info',
      unread: true,
    },
    {
      id: '3',
      title: 'Lỗi build',
      description: 'Build #234 thất bại. Vui lòng kiểm tra log.',
      time: dayjs().subtract(1, 'day').toDate(),
      status: 'error',
      unread: false,
    },
  ]);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg1',
      content: 'Chào mọi người, chúng ta deploy release mới tối nay nhé?',
      timestamp: '09:15',
      sender: { id: '1', name: 'Alice' },
    },
    {
      id: 'msg2',
      content: 'Được đó, mình sẽ hoàn thành phần editor trước 5 giờ.',
      timestamp: '09:16',
      sender: { id: '2', name: 'Bob' },
    },
    {
      id: 'msg3',
      content: 'Okay nhé, nhớ chuẩn bị migration.',
      timestamp: '09:17',
      sender: { id: '0', name: 'Me' },
      fromMe: true,
    },
  ]);

  const tableColumns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Author', dataIndex: 'author', key: 'author' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Views', dataIndex: 'views', key: 'views' },
  ];

  const tableData = [
    { key: '1', title: 'NestJS Authentication Best Practices', author: 'Alice', status: 'Published', views: 1240 },
    { key: '2', title: 'Mastering Next.js 14 App Router', author: 'Bob', status: 'Draft', views: 540 },
    { key: '3', title: 'State Management with Zustand', author: 'Cameron', status: 'Published', views: 860 },
  ];
  const chatParticipants = [
    { id: '1', name: 'Alice', online: true },
    { id: '2', name: 'Bob', online: true },
    { id: '0', name: 'Me', online: true },
  ];

  const handleFormSubmit = (values: any) => {
    success({
      message: 'Form Submitted',
      description: `Title: ${values.title}`,
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === item.id ? { ...notification, unread: false } : notification,
      ),
    );
    info({
      message: item.title,
      description: item.description,
    });
  };

  const handleSendChat = (message: string) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      content: message,
      timestamp: dayjs().format('HH:mm'),
      sender: { id: '0', name: 'Me' },
      fromMe: true,
    };
    setChatMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Title level={1} className="text-center mb-8">
          Component Library Demo
        </Title>
        {contextHolder}

        {/* Theme Toggle */}
        <div className="mb-6 text-right">
          <AntdButton onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            Toggle Theme ({theme})
          </AntdButton>
        </div>

        {/* AntdButtons Section */}
        <AntdCard title="AntdButtons" className="mb-6">
          <Space wrap>
            <AntdButton variant="primary">Primary AntdButton</AntdButton>
            <AntdButton variant="secondary">Secondary AntdButton</AntdButton>
            <AntdButton variant="danger">Danger AntdButton</AntdButton>
            <AntdButton variant="ghost">Ghost AntdButton</AntdButton>
            <AntdButton variant="link">Link AntdButton</AntdButton>
            <AntdButton size="small">Small</AntdButton>
            <AntdButton size="medium">Medium</AntdButton>
            <AntdButton size="large">Large</AntdButton>
            <AntdButton icon={<EditOutlined />}>With Icon</AntdButton>
            <AntdButton loading>AntdLoading</AntdButton>
            <AntdButton disabled>Disabled</AntdButton>
          </Space>
        </AntdCard>

        {/* AntdInputs Section */}
        <AntdCard title="AntdInputs" className="mb-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <AntdInput 
                label="Text AntdInput" 
                placeholder="Enter text..."
                helperText="This is helper text"
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <AntdInput 
                label="Password AntdInput" 
                type="password"
                placeholder="Enter password..."
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <AntdInput 
                label="Error AntdInput" 
                placeholder="This has an error"
                error="This field is required"
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <AntdInput 
                label="Required AntdInput" 
                placeholder="Required field"
                required
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <AntdInput 
                label="With Prefix" 
                prefix={<UserOutlined />}
                placeholder="Username"
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <AntdInput 
                label="Search AntdInput" 
                placeholder="Search..."
                allowClear
              />
            </Col>
            <Col xs={24}>
              <AntdTextArea 
                label="Textarea" 
                rows={4}
                placeholder="Enter long text..."
                helperText="You can enter multiple lines"
              />
            </Col>
          </Row>
        </AntdCard>

        {/* AntdSelect & AntdCheckbox & Radio */}
        <AntdCard title="AntdSelect, AntdCheckbox & Radio" className="mb-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <AntdSelect
                label="AntdSelect Dropdown"
                placeholder="Choose an option"
                options={[
                  { label: 'Option 1', value: '1' },
                  { label: 'Option 2', value: '2' },
                  { label: 'Option 3', value: '3' },
                ]}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <AntdSelect
                label="Multiple AntdSelect"
                mode="multiple"
                placeholder="Choose multiple"
                options={[
                  { label: 'AntdTag 1', value: 'tag1' },
                  { label: 'AntdTag 2', value: 'tag2' },
                  { label: 'AntdTag 3', value: 'tag3' },
                ]}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="space-y-2">
                <Text strong>AntdCheckboxes:</Text>
                <div>
                  <AntdCheckbox label="AntdCheckbox 1" />
                </div>
                <div>
                  <AntdCheckbox label="AntdCheckbox 2" defaultChecked />
                </div>
                <div>
                  <AntdCheckbox label="AntdCheckbox 3" disabled />
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <AntdRadioGroup
                label="Radio Group"
                options={[
                  { label: 'Option A', value: 'a' },
                  { label: 'Option B', value: 'b' },
                  { label: 'Option C', value: 'c' },
                ]}
                defaultValue="a"
              />
            </Col>
          </Row>
        </AntdCard>

        {/* AntdCards Section */}
        <AntdCard title="AntdCards" className="mb-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <AntdCard 
                title="Basic AntdCard"
                hoverable
              >
                <Paragraph>This is a basic card with hover effect.</Paragraph>
              </AntdCard>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <AntdCard 
                title="AntdCard with Extra"
                extra={<AntdButton size="small">More</AntdButton>}
              >
                <Paragraph>AntdCard with extra action button.</Paragraph>
              </AntdCard>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <AntdCard 
                title="AntdCard with Actions"
                actions={[
                  <HeartOutlined key="like" />,
                  <MessageOutlined key="comment" />,
                  <ShareAltOutlined key="share" />,
                ]}
              >
                <Paragraph>AntdCard with action buttons at bottom.</Paragraph>
              </AntdCard>
            </Col>
          </Row>
        </AntdCard>

        {/* AntdAvatar & AntdBadge Section */}
        <AntdCard title="AntdAvatar & AntdBadge" className="mb-6">
          <Space size="large" wrap>
            <div>
              <Text strong className="block mb-2">AntdAvatars:</Text>
              <Space>
                <AntdAvatar size="small" name="John Doe" />
                <AntdAvatar size="default" name="Jane Smith" />
                <AntdAvatar size="large" name="Bob Johnson" />
                <AntdAvatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
              </Space>
            </div>
            <div>
              <Text strong className="block mb-2">AntdBadges:</Text>
              <Space>
                <AntdBadge count={5}>
                  <AntdAvatar shape="square" size="large" icon={<UserOutlined />} />
                </AntdBadge>
                <AntdBadge count={0} showZero>
                  <AntdAvatar shape="square" size="large" icon={<UserOutlined />} />
                </AntdBadge>
                <AntdBadge variant="dot">
                  <AntdAvatar shape="square" size="large" icon={<UserOutlined />} />
                </AntdBadge>
                <AntdBadge count={99}>
                  <AntdButton>Notifications</AntdButton>
                </AntdBadge>
              </Space>
            </div>
          </Space>
        </AntdCard>

        {/* AntdTags Section */}
        <AntdCard title="AntdTags" className="mb-6">
          <Space wrap>
            <AntdTag>Default AntdTag</AntdTag>
            <AntdTag variant="success">Success AntdTag</AntdTag>
            <AntdTag variant="warning">Warning AntdTag</AntdTag>
            <AntdTag variant="error">Error AntdTag</AntdTag>
            <AntdTag variant="info">Info AntdTag</AntdTag>
            <AntdTag color="purple">Purple AntdTag</AntdTag>
            <AntdTag color="cyan">Cyan AntdTag</AntdTag>
            <AntdTag closable>Closable AntdTag</AntdTag>
          </Space>
        </AntdCard>

        {/* AntdAlerts Section */}
        <AntdCard title="AntdAlerts" className="mb-6">
          <Space direction="vertical" style={{ width: '100%' }}>
            <AntdAlert
              message="Success AntdAlert"
              description="This is a success message with description."
              type="success"
              closable
            />
            <AntdAlert
              message="Info AntdAlert"
              description="This is an info message."
              type="info"
            />
            <AntdAlert
              message="Warning AntdAlert"
              description="This is a warning message."
              type="warning"
            />
            <AntdAlert
              message="Error AntdAlert"
              description="This is an error message."
              type="error"
            />
          </Space>
        </AntdCard>

        {/* AntdLoading & AntdEmpty States */}
        <AntdCard title="AntdLoading & AntdEmpty States" className="mb-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <AntdCard title="AntdLoading States">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <AntdButton onClick={() => setLoading(!loading)}>
                    Toggle Loading
                  </AntdButton>
                  {loading && <AntdLoading tip="Đang tải dữ liệu..." />}
                </Space>
              </AntdCard>
            </Col>
            <Col xs={24} sm={12}>
              <AntdCard title="AntdEmpty State">
                <AntdEmpty description="Không có dữ liệu để hiển thị" />
              </AntdCard>
            </Col>
          </Row>
        </AntdCard>

        {/* AntdModal Section */}
        <AntdCard title="AntdModal" className="mb-6">
          <AntdButton onClick={() => setModalOpen(true)}>
            Open Modal
          </AntdButton>
          <AntdModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Modal Title"
            width={600}
          >
            <Paragraph>
              This is a modal dialog. You can put any content here.
            </Paragraph>
            <Paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Paragraph>
            <div className="mt-4 text-right">
              <Space>
                <AntdButton variant="secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </AntdButton>
                <AntdButton onClick={() => setModalOpen(false)}>
                  OK
                </AntdButton>
              </Space>
            </div>
          </AntdModal>
        </AntdCard>

        {/* AntdDivider Section */}
        <AntdCard title="AntdDivider" className="mb-6">
          <Paragraph>
            Text above divider
          </Paragraph>
          <AntdDivider />
          <Paragraph>
            Text below divider
          </Paragraph>
          <AntdDivider orientation="left">Left Text</AntdDivider>
          <AntdDivider orientation="right">Right Text</AntdDivider>
          <AntdDivider orientation="center">Center Text</AntdDivider>
          <AntdDivider dashed>Dashed AntdDivider</AntdDivider>
        </AntdCard>

        {/* Post AntdCard Example */}
        <AntdCard title="Post AntdCard Example" className="mb-6">
          <AntdCard
            hoverable
            className="mb-4"
            actions={[
              <Space key="likes">
                <HeartOutlined /> <Text>24</Text>
              </Space>,
              <Space key="comments">
                <MessageOutlined /> <Text>8</Text>
              </Space>,
              <Space key="views">
                <EyeOutlined /> <Text>156</Text>
              </Space>,
              <ShareAltOutlined key="share" />,
            ]}
          >
            <div className="flex gap-4">
              <AntdAvatar 
                size={64} 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                name="John Doe"
              />
              <div className="flex-1">
                <Title level={4} className="mb-2">
                  Getting Started with Next.js 14
                </Title>
                <Paragraph className="text-gray-600 mb-3">
                  Learn how to build modern web applications with Next.js 14, 
                  featuring the new App Router, Server Components, and more...
                </Paragraph>
                <Space wrap className="mb-3">
                  <AntdTag>Next.js</AntdTag>
                  <AntdTag>React</AntdTag>
                  <AntdTag>TypeScript</AntdTag>
                  <AntdTag>Web Development</AntdTag>
                </Space>
                <div className="flex items-center justify-between">
                  <Text type="secondary">
                    <UserOutlined /> John Doe • 2 days ago
                  </Text>
                  <Space>
                    <AntdButton size="small" icon={<EditOutlined />}>
                      Edit
                    </AntdButton>
                    <AntdButton size="small" variant="danger" icon={<DeleteOutlined />}>
                      Delete
                    </AntdButton>
                  </Space>
                </div>
              </div>
            </div>
          </AntdCard>
        </AntdCard>

        {/* AntdForm Section */}
        <AntdForm
          form={form}
          title="Create Blog Post"
          description="Reusable form wrapper built on top of Ant Design"
          onFinish={handleFormSubmit}
          wrapperClassName="mb-6"
        >
          <AntdFormItem
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter title' }]}
          >
            <AntdInput placeholder="Awesome blog title..." />
          </AntdFormItem>
          <AntdFormItem
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Select category' }]}
          >
            <AntdSelect
              placeholder="Select category"
              options={[
                { label: 'Tech', value: 'tech' },
                { label: 'Life', value: 'life' },
                { label: 'Productivity', value: 'productivity' },
              ]}
            />
          </AntdFormItem>
          <AntdFormItem label="Short Description" name="description">
            <AntdTextArea rows={3} placeholder="What is this post about?" />
          </AntdFormItem>
          <div className="text-right">
            <AntdButton htmlType="submit">Save Post</AntdButton>
          </div>
        </AntdForm>

        {/* AntdTable Section */}
        <AntdTable
          title="Recently Updated Posts"
          description="Common table wrapper with default spacing and scroll"
          columns={tableColumns}
          dataSource={tableData}
          pagination={false}
          rowKey="key"
          wrapperClassName="mb-6"
        />

        {/* Notification Section */}
        <AntdCard title="Notifications" className="mb-6">
          <Space wrap>
            <AntdButton
              variant="primary"
              onClick={() =>
                success({
                  message: 'Success',
                  description: 'Blog post published successfully',
                })
              }
            >
              Show Success
            </AntdButton>
            <AntdButton
              variant="ghost"
              onClick={() =>
                info({
                  message: 'Info',
                  description: 'Remember to add cover image',
                })
              }
            >
              Show Info
            </AntdButton>
          </Space>
        </AntdCard>

        {/* Notification Popover */}
        <AntdCard title="Notification Popover" description="Bell icon with dropdown feed" className="mb-6">
          <AntdNotificationPopover
            notifications={notifications}
            onMarkAllRead={markAllNotificationsRead}
            onItemClick={handleNotificationClick}
          />
        </AntdCard>

        {/* Chat Component */}
        <AntdCard title="Chat Component" description="Real-time chat UI skeleton" className="mb-6">
          <AntdChat
            participants={chatParticipants}
            messages={chatMessages}
            onSend={handleSendChat}
          />
        </AntdCard>

        {/* AntdEditor Section */}
        <AntdCard title="AntdEditor" description="Rich text editor powered by Tiptap" className="mb-6">
          <AntdEditor
            value={editorValue}
            onChange={setEditorValue}
            helperText="Supports headings, lists, code blocks and links."
          />
          <div className="flex justify-between items-center mt-4">
            <Text type="secondary" className="text-sm">
              Content length: {editorValue.length} characters
            </Text>
            <Space>
              <AntdButton variant="ghost" onClick={() => setEditorValue('<p>Share your thoughts...</p>')}>
                Reset
              </AntdButton>
              <AntdButton
                onClick={() =>
                  success({
                    message: 'Content saved',
                    description: 'Editor content persisted successfully',
                  })
                }
              >
                Save Draft
              </AntdButton>
            </Space>
          </div>
        </AntdCard>

        {/* Color Palette */}
        <AntdCard title="Color Palette" className="mb-6">
          <Row gutter={[16, 16]}>
            {['primary', 'success', 'warning', 'error', 'info'].map((color) => (
              <Col key={color} xs={24} sm={12} md={8}>
                <AntdCard>
                  <Text strong className="capitalize mb-2 block">{color}</Text>
                  <Space>
                    <AntdButton variant={color as any}>{color}</AntdButton>
                    <AntdTag variant={color as any}>{color}</AntdTag>
                  </Space>
                </AntdCard>
              </Col>
            ))}
          </Row>
        </AntdCard>
      </div>
    </div>
  );
}

