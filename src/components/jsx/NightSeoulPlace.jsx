import { useEffect, useState } from "react";
import NaverMap from "./NaverMap";  // 지도 컴포넌트
import axios from "axios";
import "@/locales/i18n";
import i18n from 'i18next';  
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../css/DaySeoulPlace.css";
import axiosInstance from "../../axiosInstance";
import proj4 from 'proj4';

function NightSeoulPlace({ category, contentId}) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [spots, setSpots] = useState([]);
  const [places, setPlaces] = useState([]);
  const clientId = import.meta.env.VITE_NAVER_API_ID;
  const clientSecret = import.meta.env.VITE_NAVER_API_SECRET;
  const APIKEY = import.meta.env.VITE_KOREA_TOURIST_DAY_API_KEY;
  const location = JSON.parse(localStorage.getItem("location")) || {};
  const navigate = useNavigate();
  const defaultImage = "/public/img/non_img.png"

  //UTM-K 좌표계
  const proj4_5174 = '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +datum=WGS84 +units=m +no_defs';
  //GRS80(중부원점) 좌표계
  var grs80 = "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs";
  //wgs84(위경도)좌표계
  const proj4_4326 = '+proj=longlat +datum=WGS84 +no_defs';

  const convertCoordinates = (x, y) => {
      // 좌표 변환
      const [lon, lat] = proj4(proj4_5174, proj4_4326, [x, y]);

      // 변환된 경도(lon)와 위도(lat)를 반환
      return { lon, lat };
  };
  console.log(category)
  // 서울 TOP5 검색
  useEffect(() => {
    if (!category) return;
    const searchCategory = category.split("(")[0].trim();

    const fetchSpots = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get("/api/v1/search/local.json", {
          params: {
            query: searchCategory,
            display: 5,
            sort: "comment",
          },
          headers: {
            "X-Naver-Client-Id": clientId,
            "X-Naver-Client-Secret": clientSecret,
          },
        });
        setSpots(data.items.map(item => ({
          add: item.address,
          link: item.link,
          lon: item.mapx / 10000000, // 경도
          lat: item.mapy / 10000000, // 위도
          title: item.title.replace(/<[^>]*>/g, '')
        })) || []);
      } catch (error) {
        console.error("검색 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };


    fetchSpots();
  }, [category]);
  

  useEffect(() => {
    axiosInstance.get(`/places/nightlist?contentId=${contentId}`)
    .then(response => {
      // 서버 응답이 배열인지를 확인
      if (Array.isArray(response.data)) {
        const updatedData = response.data.map(item => {
          console.log(item.x,item.y)
          const { lon, lat } = convertCoordinates(item.x, item.y); // KATEC -> WGS84 변환
          console.log(lon,lat)
          return {
            ...item,  // 기존의 모든 속성
            lon: lon,  // 변환된 lon (경도)
            lat: lat,  // 변환된 lat (위도)
            add: item.addo,  // 기타 속성
          };
        });
        console.log(updatedData)
        setPlaces(updatedData);
      } else {
        setPlaces([]); // 배열이 아닐 경우 빈 배열로 초기화
      }
    })
    .catch(error => {
      console.error("Error fetching places", error);
      setPlaces([]); // 에러 발생 시 빈 배열로 설정
    });
  }, [contentId]);
 
  return (
    <div className="page-with-maps">
      <div className="map-container">
        {isLoading ? (
          <p>{t("loading")}</p>
        ) : (
          <div className="map-with-top5">
            <div className="spot-map">
            <NaverMap items={[...spots,...places]} language={i18n.language} zoom={13}/>
            </div>
            <div className="spot-container">
              <h4 className="top5">{t("top5")}</h4>
              {spots.map((spot, index) => (
                <div key={index} className="spot-item">
                  <a href={spot.link} target="_blank" rel="noopener noreferrer">
                    <h3>{spot.title}</h3>
                    <p className="spot-address">{spot.add}</p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="night-container">
        <h1 className="night-title">장소 리스트</h1>
        <div className="night-placeList">
          <ul>
            {places.length === 0 ? (
              <li className="night-noPlace">장소 목록이 없습니다.</li>
            ) : (
              places.map(place => (
                <li key={place.id} className="night-placeItem">
                  {/* 장소 이미지 */}
                  <img
                    src={place.image || defaultImage}  // 이미지가 없으면 기본 이미지 사용
                    alt={place.title}
                    className="night-placeImage"
                  />
                  <div className="night-placeDetails">
                    {/* 장소 제목, 주소, 전화번호 */}
                    <h3 className="night-placeTitle">{place.title}</h3>
                    <p className="night-placeAddress">{place.addn}</p>
                    <p className="night-placePhone">tel {place.tel}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NightSeoulPlace;
