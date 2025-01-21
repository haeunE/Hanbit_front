import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import "../css/MyReviews.css"
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews } from '../../redux/myReviews';
import ModalController from '../../components/jsx/ModalController';
import { useTranslation } from 'react-i18next';


const MyReviews = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user !== null ? state.auth.user.id : null);
  const reviews = useSelector((state) => state.reviews.list);
  const status = useSelector((state) => state.reviews.status);
  const error = useSelector((state) => state.reviews.error);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null); // 선택된 리뷰
  console.log(reviews)
  
  useEffect(() => {
    if (userId) {
      dispatch(fetchReviews(userId)); 
    }
  }, [dispatch, userId]); 

  // 삭제 처리
  const handleDelete = async (id) => {
    try { 
      await axiosInstance.delete(`/reviews/delete/?reviewId=${id}`);
      alert(t('myreview.reviewDeleted'));
      dispatch(fetchReviews(userId)); // 리뷰 목록 갱신
    } catch (err) {
      alert(t('myreview.deleteFailed') + err.message);
    }
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    setShowEditModal(true); // 모달 열기
  };

  if (status === 'loading') return <p>{t('myreview.loading')}</p>;
  if (status === 'failed') return <p>{t('myreview.error')}: {error}</p>;

  return (
    <Container>
      <div className="myreview-container">
        <h1 className="myreview-title">{t('myreview.myReviewsTitle')}</h1>
        {reviews.length === 0 ? (
          <p className="myreview-no-reviews">{t('myreview.noReviewsFound')}</p>
        ) : (
          <ul className="myreview-list">
            {reviews.map((review) => (
              <li key={review.id} className="myreview-item">
                <div className="myreview-header">
                  <div className="placetitle-container">
                    <button
                      className="placetitle-button"
                      onClick={() => window.open(`http://localhost:5173/places/${review.placeid}/${review.typeid}`, '_blank')}
                    >
                      {review.placetitle}
                    </button>
                  </div>
                </div>
                <h2 className="myreview-item-title">{review.title}</h2>
                <p className="myreview-item-content">{review.content}</p>
                
                <div className="image-previews">
                  {review.photos.map((image, id) => (
                    <div key={id} className="image-container">
                      <img
                        src={`${import.meta.env.VITE_REACT_APP_SERVER_URL}/upload/${image.url}`}
                        alt={`image-${id}`}
                        className="preview-image"
                      />
                    </div>
                  ))}
                </div>
                <div className="myreview-dates">
                  <span>
                    {new Date(review.createDate).toLocaleDateString()}
                    {review.createDate !== review.updateDate && ` ${t('myreview.updated', { date: new Date(review.updateDate).toLocaleDateString() })}`}
                  </span>
                </div>
                <div className="myreview-buttons">
                  <button className="myreview-edit" onClick={() => handleEdit(review)}>
                    {t('myreview.edit')}
                  </button>
                  <button className="myreview-delete" onClick={() => handleDelete(review.id)}>
                    {t('myreview.delete')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* 수정 모달 */}
        {showEditModal && selectedReview && (
          <ModalController
            show={showEditModal}
            onClose={() => setShowEditModal(false)} // 모달 닫기
            review={selectedReview} // 선택된 리뷰 전달
          />
        )}
      </div>
    </Container>
  );
};


export default MyReviews;
