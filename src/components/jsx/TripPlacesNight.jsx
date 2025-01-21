import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // i18n 사용
import axiosInstance from "../../axiosInstance";

function TripPlacesNight({ contentId }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const defaultImage = "/public/img/non_img.png"

  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`/places/nightlist?contentId=${contentId}`)
      .then((response) => {
        console.log(response.data)
        setPlaces(response.data);
      })
      .catch((error) => {
        console.error("Error fetching places", error);
        setPlaces([]); // 에러 발생 시 빈 배열 설정
      })
      .finally(() => {
        setIsLoading(false); // 데이터 로드 완료 후 로딩 상태 변경
      });
  }, [contentId]);

  const handleImageClick = (id) => {
    console.log("Clicked Place ID:", id);
    navigate(`/places/${id}`);
  };

  return (
    <div className="place-card">
      {isLoading ? (
        <div className="loading-container">
          <p>{t("loading")}</p>
        </div>
      ) : !places || places.length === 0 ? (
        <div className="no-places-container">
          <p>{t("noPlacesFound")}</p>
        </div>
      ) : (
        <div className="place-container">
          {places.map((place) => (
            <div
              key={place.id}
              className="place-item"
              style={{ backgroundImage: `url(${place.img|| defaultImage})` }}
              onClick={() => handleImageClick(place.id)}
            >
              <div className="img-info">
                <div className="place-addr">{place.add}</div>
                <div className="place-title">{place.title}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TripPlacesNight;
