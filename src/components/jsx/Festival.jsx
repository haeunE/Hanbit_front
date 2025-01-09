import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import '../css/Festival.css'

function Festival(){
  const location = JSON.parse(localStorage.getItem("location"));
  const APIKEY = import.meta.env.VITE_KOREA_Festival_DAY_API_KEY;
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const city = location.city;
    const URL = `http://openapi.seoul.go.kr:8088/${APIKEY}/json/culturalEventInfo/2/100/%20/${city}`;

    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        const items = data.culturalEventInfo.row || [];

        // 2025년 이후 날짜 필터링
        const filteredItems = items.filter(item => {
          const eventDate = item.DATE;
          if (!eventDate) return false;

          const year = parseInt(eventDate.split('-')[0], 10);
          return year >= 2025;
        });

        // 랜덤으로 4개 이벤트만 선택
        const randomEvents = filteredItems
          .sort(() => Math.random() - 0.5) // 배열 섞기
          .slice(0, 3); // 앞의 4개 항목만 추출

        setEvents(randomEvents);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('API 호출 오류:', error);
      });
  }, [location.city]);

  // 날짜 포맷 함수
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replaceAll(".", ".");  // 점(.)으로 구분된 날짜 포맷
  };

  return (
    <div className="event-card">
      {isLoading ? (
        <div className="loading-container">
          <p>로딩 중...</p>  {/* 로딩 중 텍스트 */}
        </div>
      ) : (
        <div className="event-container">
          {events.map((event, index) => (
            <Link key={index} to={event.ORG_LINK} className="event-item" style={{ backgroundImage: `url(${event.MAIN_IMG})` }}>
              <div className="img-info-event">
                <div className="event-title">{event.TITLE}</div>
                <div className="event-place">{event.PLACE}</div>
                <div className="event-date">
                  {formatDate(event.STRTDATE)} ~ {formatDate(event.END_DATE)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Festival;
