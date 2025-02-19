import { useState, useEffect } from 'react';
import "../css/ScrollToTopButton.css"
import { useDispatch, useSelector } from 'react-redux';
import { SetIsMode } from '../../redux/modeState';

function ScrollToTopButton () {
  const isMode = useSelector((state) => state.isMode);
  const dispatch = useDispatch();
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
      const savedMode = JSON.parse(localStorage.getItem("isMode"));
      if (savedMode !== null) {
        dispatch(SetIsMode(savedMode));
      }

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
          style={{ backgroundColor: isMode ? "#00b493" : "rgb(248, 73, 108)" }} 
          className="scroll-to-top" 
          onClick={scrollToTop}
        >
          <i className="fas fa-arrow-up"></i>
        </button>        
        )}
      </div>
    );
  }

export default ScrollToTopButton