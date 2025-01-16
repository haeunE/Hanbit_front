import { useState } from "react";
import "../css/ModalController.css"
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../../redux/myReviews";
import axiosInstance from "../../axiosInstance";

const ModalController = ({ show, onClose, review }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user.id);
  const [updatedTitle, setUpdatedTitle] = useState(review.title);
  const [updatedContent, setUpdatedContent] = useState(review.content);
  const [deletedImg, setDeletedImg] = useState([]);
  const [selectedReview, setSelectedReview] = useState(review);
  const [updatedPhotos, setUpdatedPhotos] = useState(review.photos);
  // 이미지 삭제 핸들러
  const handleDeleteImage = (index) => {
    const imageId = review.photos[index].id;
    // 삭제된 이미지를 deletedImg 상태에 추가
    setDeletedImg((prev) => [...prev, imageId]);

    // 사진 배열에서 해당 이미지를 제거하여 화면에서 보이지 않게 함
    setUpdatedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // 수정한 리뷰 저장
  const handleSave = () => {
    if (selectedReview && selectedReview.id) {
      axiosInstance
        .put(`/reviews/edit/?reviewId=${selectedReview.id}`, {
          title: updatedTitle,
          content: updatedContent,
          deletedImages: deletedImg, // 삭제된 이미지 정보 추가
        })
        .then(() => {
          alert('리뷰가 수정되었습니다.');
          onClose(); // 모달 닫기
          dispatch(fetchReviews(userId));
        })
        .catch((err) => {
          alert('수정 실패: ' + err.message);
        });
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>
        <h2>리뷰 수정</h2>
        <div>
          <label htmlFor="updatedTitle">제목</label>
          <input
            type="text"
            id="updatedTitle"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="updatedContent">내용</label>
          <textarea
            id="updatedContent"
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
          />
        </div>
        
        <div className="modal-images">
          <h3>이미지</h3>
          {updatedPhotos.map((image, index) => (
            <div key={index} className="image-container">
              <img
                src={`${import.meta.env.VITE_REACT_APP_SERVER_URL}/upload/${image.url}`}
                alt={`review-image-${index}`}
                className="preview-image"
              />
              <button
                type="button"
                className="myreview-img-delete"
                onClick={() => handleDeleteImage(index)}
              >
                <i className="fa-solid fa-delete-left"></i> {/* 삭제 아이콘 */}
              </button>
            </div>
          ))}
        </div>

        <button className="modal-save" onClick={handleSave}>저장</button>
      </div>
    </div>
  );
};

export default ModalController;