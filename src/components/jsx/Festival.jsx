import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../css/Festival.css";
import { SetIsLocation } from "../../redux/locationState";

function Festival() {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.isLocation);
  const APIKEY = import.meta.env.VITE_KOREA_SEOUL_DATA_API_KEY;
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedLocation = JSON.parse(localStorage.getItem("location"));
    if (savedLocation) {
      dispatch(SetIsLocation(savedLocation));
    } else {
      console.warn("Location 정보가 없습니다.");
    }
  }, [dispatch]);

  useEffect(() => {
    if (!location?.city) {
      setIsLoading(false); // 위치 정보 없을 경우 로딩 종료
      return;
    }

    const city = location.city || "서울"; // city 기본값 설정
    const URL = `http://openapi.seoul.go.kr:8088/${APIKEY}/json/culturalEventInfo/1/100/%20/${city}`;

    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        const items = data.culturalEventInfo?.row || [];

      // 오늘 날짜 이후의 END_DATE 필터링
      const currentDate = new Date();
      const filteredItems = items.filter((item) => {
        const eventEndDate = new Date(item.END_DATE); // 이벤트 종료 날짜
        return eventEndDate > currentDate; // 현재 날짜 이후만 남김
      });

        // 랜덤으로 3개 이벤트만 선택
        const randomEvents = filteredItems
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        setEvents(randomEvents);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("API 호출 오류:", error);
        setIsLoading(false);
      });
  }, [location, APIKEY]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "날짜 정보 없음";
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replaceAll(".", ".");
  };

  return (
    <div className="event-card">
      {isLoading ? (
        <div className="loading-container">
          <p>로딩 중...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="event-container">
          {events.map((event, index) => (
            <Link
              key={index}
              to={event.ORG_LINK}
              className="event-item"
              style={{ backgroundImage: `url(${event.MAIN_IMG})` }}
            >
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
      ) : (
        <p>이벤트 정보를 찾을 수 없습니다.</p>
      )}
    </div>
  );
}

export default Festival;
