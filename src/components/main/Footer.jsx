import React from "react";
import { Link } from "react-router-dom"; // react-router-dom을 사용하여 페이지 이동
import "./Footer.css";

function Footer() {
  const footerLinks = [
    { url: "https://knto.or.kr/index", img: "/img/footer/ftlogo_knto.jpg", alt: "한국관광공사" },
    { url: "https://www.data.go.kr/index.do", img: "/img/footer/ftlogo_opendata.png", alt: "공공데이터포털" },
    { url: "https://data.seoul.go.kr/", img: "/img/footer/ftlogo_seouldata.png", alt: "서울열린데이터광장" },
    { url: "https://www.culture.go.kr/data/main/main.do", img: "/img/footer/ftlogo_culturedata.png", alt: "문화공공데이터광장" },
    { url: "https://www.durunubi.kr/", img: "/img/footer/ftlogo_durunubi.jpg", alt: "두루누비" },
    { url: "https://api.visitkorea.or.kr/#/", img: "/img/footer/ftlogo_tourAPI.png", alt: "TourAPI 4.0" },
    { url: "https://mcst.go.kr/kor/main.jsp", img: "/img/footer/ftlogo_culture.jpg", alt: "문화체육관광부" },
    { url: "https://www.seoul.go.kr/main/index.jsp", img: "/img/footer/ftlogo_seoul.png", alt: "서울특별시" }
  ];

  return (
    <div className="Footer">
      <div className="footer-button">
        {footerLinks.concat(footerLinks).map((link, index) => (
          <Link to={link.url} key={index}>
            <img src={link.img} alt={link.alt} className="footer-logo" />
          </Link>
        ))}
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
