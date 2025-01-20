import React, { useEffect } from "react";
import "../css/GoogleTranslate.css"; // CSS 파일 적용
import "@/locales/i18n";
import i18n from 'i18next';  // i18n을 import

const GoogleTranslate = () => {
  useEffect(() => {
    // 구글 번역 스크립트 로드
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // 구글 번역 초기화 함수
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "ko", // 기본 언어 설정
          includedLanguages: "ko,en,zh-CN,ja", // 지원할 언어 목록
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false, // 자동 표시를 끄고 직접 조작
        },
        "google_translate_element"
      );

      setTimeout(() => {
        const select = document.querySelector(".goog-te-combo");
        if (select) {
          // 언어 옵션 강제 변경
          const options = select.options;
          for (let i = 0; i < options.length; i++) {
            if (options[i].value === "en") options[i].text = "English";
            if (options[i].value === "zh-CN") options[i].text = "中文";
            if (options[i].value === "ja") options[i].text = "日本語";
            if (options[i].value === "ko") options[i].text = "한국어";
          }
        }
      }, 1000); // 번역 위젯이 로드될 시간을 고려하여 1초 후 실행
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;
