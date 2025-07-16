// components/ModalVideo.jsx
import React, { useState } from 'react';
import { Modal, List, Typography } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ModalVideo = ({ open, onClose, videos, initialVideo }) => {
  const [currentVideo, setCurrentVideo] = useState(initialVideo || videos[0]);

  const handleVideoChange = (video) => {
    setCurrentVideo(video);
  };

  return (
    <Modal
      title={<span><PlayCircleOutlined /> Xem bài học: {currentVideo.title}</span>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src={currentVideo.url}
            title={currentVideo.title}
            frameBorder="0"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: 8,
            }}
          ></iframe>
        </div>

        <List
          header={<Title level={5}>Danh sách bài học</Title>}
          bordered
          dataSource={videos}
          renderItem={(item) => (
            <List.Item
              style={{ cursor: 'pointer', background: item.url === currentVideo.url ? '#e6f7ff' : '#fff' }}
              onClick={() => handleVideoChange(item)}
            >
              <List.Item.Meta
                title={<b>{item.title}</b>}
                description={item.duration}
              />
            </List.Item>
          )}
        />
      </div>
    </Modal>
  );
};

export default ModalVideo;
