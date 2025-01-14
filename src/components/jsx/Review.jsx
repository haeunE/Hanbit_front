import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import '../css/Review.css'; 
import axiosInstance from '../../axiosInstance';
import ReviewList from './ReviewList';


const Review = ({ placeid, typeid }) => {
  const idAuth = useSelector((state) => state.auth.isAuth); // 로그인 상태
  const user = useSelector((state) => state.auth.user);

  const [form, setForm] = useState({
    title: "",
    content: "",
    userId: user ? user.id : null,
    placeid,
    typeid,
    photos: [], // 사진 리스트
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // 전송 상태
  const [isFormVisible, setIsFormVisible] = useState(false); // 폼 표시 여부
  const [showImages, setShowImages] = useState([]); // 이미지 미리보기

  const [reviews, setReviews] = useState([]); // 서버에서 가져온 리뷰 목록 상태
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태

  // 컴포넌트가 마운트될 때 리뷰를 요청
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get(`/reviews`, {
          params: { placeid, typeid }, // placeid와 typeid를 쿼리 파라미터로 전달
        });
        console.log(response.data)
        setReviews(response.data); // 서버에서 받은 데이터를 리뷰 목록에 저장
        
      } catch (error) {
        console.error("리뷰를 가져오는 데 실패했습니다:", error);
        // alert("리뷰를 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchReviews(); // 리뷰 가져오는 함수 호출
  }, [placeid, typeid, showImages]);

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
    console.log(form)
  };

  // 미리보기 이미지 업데이트
const handleAddImages = (event) => {
  const imageLists = event.target.files;
  let updatedPhotos = [...form.photos];
  let updatedShowImages = [...showImages];

  for (let i = 0; i < imageLists.length; i++) {
    updatedPhotos.push(imageLists[i]); // 파일 객체 추가
    updatedShowImages.push(URL.createObjectURL(imageLists[i])); // 미리보기 URL 추가
  }

  if (updatedPhotos.length > 10) {
    updatedPhotos = updatedPhotos.slice(0, 10);
    updatedShowImages = updatedShowImages.slice(0, 10);
  }

  setForm((prevForm) => ({
    ...prevForm,
    photos: updatedPhotos, // 파일 객체 배열
  }));
  setShowImages(updatedShowImages); // 미리보기 이미지 URL 배열
};


  // 이미지 삭제
  const handleDeleteImage = (id) => {
    setShowImages(showImages.filter((_, index) => index !== id));
    const updatedPhotos = form.photos.filter((_, index) => index !== id);
    setForm((prevForm) => ({
      ...prevForm,
      photos: updatedPhotos, // form.photos 배열도 업데이트
    }));
  };

  // 리뷰 전송 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.title.trim() === "" || form.content.trim() === "") {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    console.log(user)
    if (!user.id) {
      alert("유효한 사용자 ID가 필요합니다.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log(user.id)
      console.log(form)
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("userId", form.userId);
      formData.append("placeid", form.placeid);
      formData.append("typeid", form.typeid);
      
      form.photos.forEach((photo) => {
        formData.append("photos", photo); // 'photos'로 전달
      });
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
      
      const response = await axiosInstance.post("/reviews/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("리뷰가 성공적으로 전송되었습니다.");
      setForm(prevForm => ({
        ...prevForm,
        title: "",
        content: "",
        photos: []
      }));
      setShowImages([]);
      setIsFormVisible(false);
    } catch (error) {
      console.error("리뷰 전송 실패:", error);
      alert("리뷰 전송 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 리뷰 작성 버튼 클릭 시 로그인 여부 확인
  const handleReviewClick = () => {
    if (!idAuth) {
      alert("로그인이 필요합니다.");
    } else {
      setIsFormVisible(true); // 폼을 보이게 설정
    }
  };

  if (loading) {
    return <p>리뷰를 불러오는 중...</p>;
  }
  

  return (
    <div className="review-container">
      <h2 className="review-title">리뷰 작성</h2>

      {idAuth ? (
        <button onClick={handleReviewClick} className="review-button">
          리뷰 작성
        </button>
      ) : (
        <p className="login-message">로그인 후 리뷰를 작성할 수 있습니다.</p>
      )}

      {isFormVisible && idAuth && (
        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label>제목:</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="input-field"
              placeholder="제목을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>내용:</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              className="textarea-field"
              placeholder="리뷰 내용을 입력하세요"
            />
          </div>

          {/* 이미지 추가 */}
          <div className="form-group">
            <label>사진:</label>
            <div className="add-picture">
              <input
                type="file"
                id="input-file"
                multiple
                accept="image/*"
                className="file-input"
                onChange={handleAddImages}
              />
              <div className="image-previews">
                {showImages.map((image, id) => (
                  <div key={id} className="image-container">
                    <img src={image} alt={`image-${id}`} className="preview-image" />
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDeleteImage(id)}
                    >
                      <i className="fa-solid fa-delete-left"></i> {/* 삭제 아이콘 */}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? "전송 중..." : "리뷰 전송"}
          </button>
        </form>
      )}
      <ReviewList reviews={reviews}/>
    </div>
    
  );
};

export default Review;
