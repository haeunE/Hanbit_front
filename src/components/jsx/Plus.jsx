import { useState } from 'react';

function Plus () {
  const [isTextVisible, setIsTextVisible] = useState(false);
  const toggleText = () => {setIsTextVisible(!isTextVisible);};
  return (
    <div>
      <button className='tt' onClick={toggleText}>비자 신청을 위한 필요한 것들</button>
      {isTextVisible && <p>
        <b>여권:</b> 유효기간이 비자 신청일로부터 최소 6개월 이상 남아 있어야 합니다.<br />
        <b>비자 신청서:</b> 한국 대사관 또는 영사관에서 제공하는 비자 신청서를 작성합니다.<br />
        <b>여권용 사진:</b> 보통 최근 6개월 이내의 여권용 사진이 필요합니다.<br />
        <b>항공권 예약 증명서:</b> 한국 입국과 출국 날짜가 기재된 항공권 예약증 또는 예매 내역.<br />
        <b>숙소 예약 증명서:</b> 호텔 예약 내역이나, 한국에 거주하는 가족/친지 초청 시 초청장과 그들의 신분증 사본.<br />
        <b>재정 증명서:</b> 은행 잔고 증명서, 급여 명세서 등 자신이 여행 경비를 충당할 수 있다는 증명.<br />
        <b>기타 서류:</b> 여행 목적에 따라 추가 서류가 필요할 수 있습니다(예: 가족 방문 시 초청장 등).<br /><br />
        </p>}
    </div>
  );
}

export default Plus;