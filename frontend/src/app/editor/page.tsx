'use client';

import { useState } from 'react';
import { Form } from 'antd';
import { AntdForm, AntdFormItem, AntdInput, AntdTextArea, AntdEditor, AntdButton, AntdAlert, AntdSelect } from '@/components/common';
import { mockTags } from '@/data/mock';

interface EditorFormValues {
  title: string;
  excerpt: string;
  tags: string[];
  content: string;
}

export default function EditorPage() {
  const [form] = Form.useForm<EditorFormValues>();
  const [content, setContent] = useState('<p>Chia sẻ kiến thức của bạn...</p>');

  const handleSubmit = (values: EditorFormValues) => {
    console.log('draft', { ...values, content });
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">Trình soạn thảo</h1>
        <p className="text-slate-600">
          Bạn cần đăng nhập để xuất bản hoặc lưu bài viết. Khách chưa đăng nhập vẫn có thể đọc tất cả bài public.
        </p>
      </div>

      <AntdAlert
        type="warning"
        message="Draft mode"
        description="Khi chưa đăng nhập, nội dung bạn nhập chỉ lưu ở local (console). Sau khi có auth flow, chúng ta sẽ gọi API để lưu draft/thêm bài."
      />

      <AntdForm
        form={form}
        layout="vertical"
        onFinish={(values) => handleSubmit(values)}
      >
        <AntdFormItem
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
        >
          <AntdInput placeholder="Ví dụ: Xây dựng blog fullstack với NestJS + Next.js" />
        </AntdFormItem>

        <AntdFormItem
          label="Mô tả ngắn"
          name="excerpt"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <AntdTextArea rows={3} placeholder="Tóm tắt nội dung chính..." />
        </AntdFormItem>

        <AntdFormItem
          label="Tags"
          name="tags"
          rules={[{ required: true, message: 'Chọn ít nhất 1 tag' }]}
        >
          <AntdSelect
            mode="tags"
            placeholder="Chọn tags"
            options={mockTags.map((tag) => ({ label: tag.name, value: tag.name }))}
          />
        </AntdFormItem>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Nội dung</label>
          <AntdEditor value={content} onChange={setContent} />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <AntdButton variant="ghost" onClick={() => form.resetFields()}>
            Huỷ
          </AntdButton>
          <AntdButton type="primary" htmlType="submit">
            Lưu bản nháp
          </AntdButton>
        </div>
      </AntdForm>
    </main>
  );
}

