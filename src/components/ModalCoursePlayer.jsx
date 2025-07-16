// components/ModalCoursePlayer.jsx
import React, { useState } from 'react';
import { Modal, List } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';

export default function ModalCoursePlayer({ visible, onClose, course }) {
  const [currentVideo, setCurrentVideo] = useState(null);

  const lessons = course?.lessons || [];

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      title={course?.name}
      footer={null}
      width={900}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ padding: 16 }}>
        {currentVideo ? (
          <>
            <video width="100%" controls src={currentVideo.url} />
            <h3 style={{ marginTop: 12 }}>{currentVideo.title}</h3>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: '#888', padding: 32 }}>
            Chọn bài học bên dưới để xem video.
          </div>
        )}
      </div>

      <div style={{ maxHeight: 300, overflowY: 'auto', borderTop: '1px solid #eee' }}>
        <List
          itemLayout="horizontal"
          dataSource={lessons}
          renderItem={(lesson) => (
            <List.Item
              onClick={() => setCurrentVideo(lesson)}
              style={{ cursor: 'pointer', paddingLeft: 24 }}
            >
              <VideoCameraOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              {lesson.title} ({lesson.duration})
            </List.Item>
          )}
        />
      </div>
    </Modal>
  );
}
