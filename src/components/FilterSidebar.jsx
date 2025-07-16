import React from 'react';
import {
  Drawer,
  Input,
  Select,
  Checkbox,
  Typography,
  Button,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  StarFilled,
  StarTwoTone,
  StarOutlined,
} from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;

export default function FilterSidebar({
  visible,
  onClose,
  isMobile,
  keyword,
  onKeywordChange,
  priceRange,
  onPriceChange,
  ratingFilter,
  onRatingChange,
  durationFilter,
  onDurationChange,
}) {
  const content = (
    <div style={{ padding: isMobile ? 0 : 16 }}>
      <Title level={4} style={{ marginBottom: 16 }}>
        <SearchOutlined /> Bộ lọc
      </Title>

      <Input
        prefix={<SearchOutlined />}
        placeholder="Tìm sản phẩm..."
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        allowClear
        style={{ marginBottom: 20 }}
      />

      <label style={{ fontWeight: 600 }}>
        <DollarOutlined /> Mức giá
      </label>
      <Select
        value={priceRange}
        onChange={onPriceChange}
        style={{ width: '100%', marginTop: 8, marginBottom: 24 }}
      >
        <Option value="all">Tất cả mức giá</Option>
        <Option value="<500">Dưới 500K</Option>
        <Option value="500-1000">500K – 1 triệu</Option>
        <Option value=">1000">Trên 1 triệu</Option>
      </Select>

      <Divider />

      <label style={{ fontWeight: 600 }}>
        <ClockCircleOutlined /> Thời lượng video
      </label>
      <Checkbox.Group
        value={durationFilter}
        onChange={onDurationChange}
        style={{ display: 'flex', flexDirection: 'column', marginTop: 8, marginBottom: 24 }}
      >
        <Checkbox value="<1">Dưới 1 giờ</Checkbox>
        <Checkbox value="1-3">1 – 3 giờ</Checkbox>
        <Checkbox value="3-6">3 – 6 giờ</Checkbox>
        <Checkbox value="6-17">6 – 17 giờ</Checkbox>
      </Checkbox.Group>

      <Divider />

      <label style={{ fontWeight: 600 }}>
        <StarFilled /> Xếp hạng
      </label>
      <Checkbox.Group
        value={ratingFilter}
        onChange={onRatingChange}
        style={{ display: 'flex', flexDirection: 'column', marginTop: 8 }}
      >
        <Checkbox value="4.5">
          {[...Array(5)].map((_, i) => (
            <StarTwoTone twoToneColor="#faad14" key={i} />
          ))} Từ 4.5 trở lên
        </Checkbox>
        <Checkbox value="4">
          {[...Array(4)].map((_, i) => (
            <StarTwoTone twoToneColor="#faad14" key={i} />
          ))} Từ 4.0 trở lên
        </Checkbox>
        <Checkbox value="3.5">
          {[...Array(3)].map((_, i) => (
            <StarTwoTone twoToneColor="#faad14" key={i} />
          ))} Từ 3.5 trở lên
        </Checkbox>
      </Checkbox.Group>
    </div>
  );

  return isMobile ? (
    <Drawer
      placement="left"
      width="100%"
      onClose={onClose}
      open={visible}
      title="Bộ lọc"
      footer={
        <Button type="primary" block onClick={onClose}>
          Xong
        </Button>
      }
    >
      {content}
    </Drawer>
  ) : (
    <div className="filter-sidebar">{content}</div>
  );
}
