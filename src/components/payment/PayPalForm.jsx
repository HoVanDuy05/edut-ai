import { Button, Typography } from 'antd';
const { Text } = Typography;

export default function PayPalForm({ onSubmit }) {
  return (
    <div>
      <Text>Vui lòng thanh toán qua PayPal tại liên kết dưới:</Text>
      <br />
      <a
        href="https://www.paypal.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        https://www.paypal.com
      </a>
      <br />
      <Button type="primary" onClick={onSubmit} style={{ marginTop: 16 }} block>
        Tôi đã thanh toán qua PayPal
      </Button>
    </div>
  );
}
