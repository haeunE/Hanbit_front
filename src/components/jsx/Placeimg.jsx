import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Placeimg.css"

const Placeimg = ({ contentId , firstimage}) => {
  console.log(firstimage)
  const [images, setImages] = useState([firstimage]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  // API 호출
  const fetchImages = async () => {
    setLoading(true);
    setError(""); // 에러 초기화
    try {
      const apiKey = import.meta.env.VITE_KOREA_TOURIST_DAY_API_KEY; // API 키
      const url = `https://apis.data.go.kr/B551011/KorService1/detailImage1?MobileOS=WIN&MobileApp=hanbit&contentId=${contentId}&imageYN=Y&serviceKey=${apiKey}&_type=json&subImageYN=Y`;

      const response = await axios.get(url);
      console.log(response.data);

      // API 응답 데이터 확인
      if (
        response.data &&
        response.data.response &&
        response.data.response.body &&
        response.data.response.body.items &&
        response.data.response.body.items.item
      ) {
        const items = response.data.response.body.items.item;
        const additionalImages = items.map((item) => item.originimgurl);
        setImages([firstimage, ...additionalImages]);// 이미지 데이터 저장
      } else {
        setError("No images found"); // 이미지가 없는 경우 에러 설정
      }
    } catch (err) {
      setError("Failed to fetch images: " + err.message); // API 호출 실패
    } finally {
      setLoading(false); // 로딩 상태 해제
    }
  };

  useEffect(() => {
    if (contentId) {
      fetchImages(); // contentId가 있을 때만 API 호출
    }
  }, [contentId]);

  // 이전 버튼 클릭 시 처리
  const handlePrevClick = () => {
    setSelectedIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  // 다음 버튼 클릭 시 처리
  const handleNextClick = () => {
    setSelectedIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  // 이미지 클릭 시 선택된 이미지로 변경
  const handleImageClick = (index) => {
    setSelectedIndex(index);
  };

  console.log(images)
  return (
    <div className="img-container">
      {loading && <p>Loading...</p>}

      <div className="img-main-container">
        {/* 선택된 이미지와 버튼 */}
        <div className="select-img-container">
          {/* 선택된 이미지 */}
          <div className="img-main">
            {images[selectedIndex] && (
              <img
                src={images[selectedIndex]} // 이미지 URL
                alt={`Selected Image`}
                className="img-mainimage"
              />
            )}
          </div>

          {/* 캐러셀 버튼을 이미지 아래에 배치 */}
          {images.length > 1 && (
            <div className="img-carousel-buttons">
              <button
                className="img-carousel-button prev"
                onClick={handlePrevClick}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                className="img-carousel-button next"
                onClick={handleNextClick}
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>

        {/* 작은 이미지들 */}
        {images.length > 1 && (
          <div className="img-small-container">
            {images.map((image, index) => (
              index !== selectedIndex && (
                <div
                  key={index}
                  className={`img-small-item ${
                    selectedIndex === index ? "selected" : ""
                  }`}
                  onClick={() => handleImageClick(index)} // 클릭 시 선택된 이미지로 변경
                >
                  <img
                    src={image} // 이미지 URL
                    alt={`Small Image ${index + 1}`}
                    className="img-small-image"
                  />
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Placeimg;
