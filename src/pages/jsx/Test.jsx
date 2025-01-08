import { useState } from "react";
import { Container } from "react-bootstrap";
import NaverBlog from "../../components/jsx/NaverBlog";
import NaverImg from "../../components/jsx/NaverImg";
import "../css/Test.css"

function Test() {
  // 상태 관리: 클릭된 레이아웃을 저장
  const [activeLayout, setActiveLayout] = useState('');

  const handleClick = (layout) => {
    setActiveLayout(layout); // 클릭된 버튼에 해당하는 레이아웃 표시
  };

  return (
    <Container>
      {/* 버튼 영역 */}
      <div className="button-container">
        <button
          className="naver-blog-button"
          onClick={() => handleClick('blog')}
        >
          블로그 보기
        </button>
        <button
          className="naver-img-button"
          onClick={() => handleClick('img')}
        >
          이미지 보기
        </button>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="place-container">
        <div className={`naver-blog ${activeLayout === 'blog' ? 'active' : ''}`}>
          <NaverBlog />
        </div>
        <div className={`naver-img ${activeLayout === 'img' ? 'active' : ''}`}>
          <NaverImg />
        </div>
      </div>
    </Container>
  );
}

export default Test;
