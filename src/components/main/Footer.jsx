import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // react-router-dom을 사용하여 페이지 이동
import "./Footer.css";

function Footer() {
  const removeFooter = useLocation();
  if (removeFooter.pathname === '/') {
    return null;
  }

  const footerLinks = [
    { url: "https://knto.or.kr/index", img: "/img/footer/ftlogo_knto.jpg", alt: "한국관광공사" },
    { url: "https://www.data.go.kr/index.do", img: "/img/footer/ftlogo_publicdata.png", alt: "publicdata" },
    { url: "https://data.seoul.go.kr/", img: "/img/footer/ftlogo_seouldata.png", alt: "서울열린데이터광장" },
    { url: "https://www.culture.go.kr/data/main/main.do", img: "/img/footer/ftlogo_culturedata.png", alt: "문화공공데이터광장" },
    { url: "https://www.durunubi.kr/", img: "/img/footer/ftlogo_durunubi.jpg", alt: "두루누비" },
    { url: "https://api.visitkorea.or.kr/#/", img: "/img/footer/ftlogo_tourAPI.png", alt: "TourAPI 4.0" },
    { url: "https://mcst.go.kr/kor/main.jsp", img: "/img/footer/ftlogo_culture.jpg", alt: "문화체육관광부" },
    { url: "https://www.seoul.go.kr/main/index.jsp", img: "/img/footer/ftlogo_seoul.png", alt: "서울특별시" }
  ];

  // 애니메이션 제어할 상태 변수
  const [animate, setAnimate] = useState(true);
  // 마우스가 슬라이더 진입 시 호출, false값으로 애니메이션 중지
  const onStop = () => setAnimate(false);
  // 마우스가 슬라이더 떠날 때 호출, true값으로 애니메이션 재시작
  const onRun = () => setAnimate(true);

  return (
    <div className="Footer">
      <div className="slide-container">
        <ul
          className="slided-wrapper"
          style={{ animationPlayState: animate ? "running" : "paused" }}
          onMouseEnter={onStop}
          onMouseLeave={onRun}
        >
          <div className="slide-original">
            {footerLinks.map((link, i) => (
              <li key={i}>
                <p className="item">
                  <a href={Link.url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={Link.img}
                      alt={Link.alt}
                      className={link.alt === "publicdata" ? "publicdata-img" : ""}
                    />
                  </a>
                </p>
              </li>
            ))}
          </div>
          <div className="slide-clone">
            {footerLinks.map((link, i) => (
              <li key={i}>
                <p className="item">
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <img
                  src={link.img}
                  alt={link.alt}
                  className={link.alt === "publicdata" ? "publicdata-img" : ""}
                />
                  </a>
                </p>
              </li>
            ))}
          </div>
        </ul>
      </div>

      <div className="footer-text">
        <p>
          서울특별시 강동구 천호대로 157길 14  (우)05335 hanbit@hanbit.com 대표전화 02-1234-1234<br />
          대표이사 한빛, 개인정보보호책임자 한빛, 사업자등록번호 111-22-33333, 통신판매업신고번호 1111-서울강동-1111<br />
          COPYRIGHT © Trip Hanbit, Inc. All rights reserved
        </p>
      </div>
    </div>
  );
}

export default Footer;
