import { Form, Input, Button } from 'antd';

export default function CreditCardForm({ onSubmit }) {
  const [form] = Form.useForm();
  return (
    <Form layout="vertical" form={form} onFinish={onSubmit}>
      <Form.Item name="cardNumber" label="Số thẻ" rules={[{ required: true }]}>
        <Input placeholder="1234 5678 9012 3456" />
      </Form.Item>
      <Form.Item name="cardHolder" label="Chủ thẻ" rules={[{ required: true }]}>
        <Input placeholder="Nguyễn Văn A" />
      </Form.Item>
      <Form.Item name="expiry" label="Ngày hết hạn" rules={[{ required: true }]}>
        <Input placeholder="MM/YY" />
      </Form.Item>
      <Form.Item name="cvv" label="CVV" rules={[{ required: true }]}>
        <Input placeholder="123" />
      </Form.Item>
      <Button type="primary" htmlType="submit" block>
        Thanh toán bằng thẻ
      </Button>
    </Form>
  );
}
