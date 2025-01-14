import '../css/Review.css'; 
const ReviewList = ({ reviews }) => (
  <div className="review-list-container">
    <h3>REVIEWS</h3>
    <hr></hr>
    {reviews.length === 0 ? (
      <p>등록된 리뷰가 없습니다.</p>
    ) : (
      <ul className="review-list">
        {reviews.map((review) => (
          <li key={review.id} className="review-item">
            <h4>{review.title}</h4>
            <p>{review.content}</p>
            <p>작성자: {review.user.username}</p>
            {review.photos?.length > 0 && (
              <div className="review-images">
                {review.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={`${import.meta.env.VITE_REACT_APP_SERVER_URL}/upload/${photo.url}`}
                    alt={`review-image-${index}`}
                    className="review-image"
                  />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
);
export default ReviewList;