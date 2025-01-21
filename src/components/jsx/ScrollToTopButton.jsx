import { useState, useEffect } from 'react';

function ScrollToTopButton () {
  const [isVisible, setIsVisible] = useState(false);
    // 스크롤 이벤트를 감지하여 버튼을 보이거나 숨기기
    const handleScroll = () => {
      if (window.scrollY > 300) {  // 화면을 300px 이상 스크롤하면 버튼이 보이게 설정
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
  
    // useEffect로 스크롤 이벤트 리스너 등록
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
  
    // 버튼 클릭 시 화면을 맨 위로 스크롤
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth', // 부드러운 스크롤 효과
      });
    };
  
    return (
      <div>
        {/* 스크롤을 클릭 시 위로 가는 버튼 */}
        {isVisible && (
          <button
            onClick={scrollToTop}
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '200px',
              fontSize: '30px',
              backgroundColor: '#00b493',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              width: '60px',   
              height: '60px'
            }}
          >
            ↑
          </button>
        )}
      </div>
    );
  }

export default ScrollToTopButton