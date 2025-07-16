import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const BannerSlider = () => {
const banners = [
  {
    id: 1,
    image: 'https://cdn.s99.vn/ss1/prod/product/8f5e25576e5360a45a606a6a1730b07e.jpg',
    alt: 'Khuyến mãi mùa hè',
    title: 'Khuyến mãi hè siêu hấp dẫn',
    description: 'Giảm tới 70% cho các khóa học hot nhất!',
    cta: 'Khám phá ngay',
  },
  {
    id: 2,
    image: 'https://file.edubit.vn/storage/d649eba6e43328bc948ec263654ab22da7557753/banner.jpg',
    alt: 'Học nhanh cùng AI',
    title: 'Học nhanh với Trí Tuệ Nhân Tạo',
    description: 'Được đề xuất khóa học phù hợp bằng AI thông minh.',
    cta: 'Trải nghiệm AI',
  },
  {
    id: 3,
    image: 'https://khokhoahoc.org/wp-content/uploads/2022/11/Bo-Combo-6-khoa-Hoc-Lap-Trinh-200Lab-Moi-Nhat.png',
    alt: 'Combo khóa học HOT',
    title: '💻 Combo khóa học lập trình HOT',
    description: '6 khóa học lập trình trong 1 combo siêu tiết kiệm!',
    cta: 'Xem combo',
  },
];

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
  };

  return (
    <div
      style={{
        width: '100%',
        overflow: 'visible',
        borderRadius: 16,
        position: 'relative',
        marginBottom: 32,
      }}
    >
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.id}>
            <img
              src={banner.image}
              alt={banner.alt}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: 400,
                objectFit: 'cover',
                borderRadius: 16,
              }}
              onError={(e) =>
                (e.target.src = 'https://via.placeholder.com/1200x400?text=Image+Not+Found')
              }
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlider;
