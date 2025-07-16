import { Image, Button, Typography } from 'antd';
const { Text } = Typography;

export default function BankTransferForm({ onSubmit }) {
  return (
    <div>
      <Text>Ngân hàng: BIDV - Số tài khoản: 123456789</Text>
      <br />
      <Text>Nội dung chuyển khoản: THANHTOAN#{Date.now()}</Text>
      <br />
      <Image
        src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=THANHTOAN"
        alt="QR ngân hàng"
        width={200}
        style={{ marginTop: 16 }}
      />
      <br />
      <Text strong>Momo / ZaloPay:</Text>
      <br />
      <Image
        src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MOMO-PAYMENT"
        alt="QR Momo"
        width={200}
        style={{ marginTop: 16, marginRight: 12 }}
      />
      <Image
        src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ZALOPAY"
        alt="QR ZaloPay"
        width={200}
        style={{ marginTop: 16 }}
      />
      <Button type="primary" onClick={onSubmit} style={{ marginTop: 16 }} block>
        Tôi đã chuyển khoản
      </Button>
    </div>
  );
}
