import "../css/Amenities.css";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const Amenities = () => {
  const mapRef = useRef(null);
  const [currCategory, setCurrCategory] = useState("");
  const markersRef = useRef([]);
  const placeOverlayRef = useRef(null);

  const location = JSON.parse(localStorage.getItem("location"));
  const defaultLat = location?.lat || 37.566826;
  const defaultLon = location?.lon || 126.9786567;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_REST_API_KEY}&libraries=services`;
    script.async = true;
    script.onload = () => {
      const { kakao } = window;
      const mapContainer = mapRef.current;
      const mapOption = {
        center: new kakao.maps.LatLng(defaultLat, defaultLon),
        level: 5,
      };
      const map = new kakao.maps.Map(mapContainer, mapOption);

      const placeOverlay = new kakao.maps.CustomOverlay({ zIndex: 1 });
      placeOverlayRef.current = placeOverlay;

      kakao.maps.event.addListener(map, "idle", () => {
        if (currCategory) {
          searchPlaces(map);
        }
      });
    };
    script.onerror = () => {
      console.error("카카오 지도 API 로드 실패");
    };
    document.head.appendChild(script);
  }, [currCategory]);

  // 🔹 카카오 장소 검색 API 추가
  const searchPlaces = async (map) => {
    placeOverlayRef.current.setMap(null);
    removeMarkers();

    try {
      const res = await axios.get(`/kakao/v2/local/search/category.json`, {
        headers: { Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}` },
        params: {
          category_group_code: currCategory,
          x: defaultLon,
          y: defaultLat,
          radius: 20000,
        },
      });

      displayPlaces(res.data.documents, map);
    } catch (error) {
      console.error("장소 검색 실패:", error);
    }
  };

  const displayPlaces = (places, map) => {
    removeMarkers();
    places.forEach((place) => {
      const marker = addMarker(place, map);
      window.kakao.maps.event.addListener(marker, "click", () => {
        displayPlaceInfo(place, map);
      });
    });
  };

  const addMarker = (place, map) => {
    const { kakao } = window;
    const position = new kakao.maps.LatLng(place.y, place.x);
    const marker = new kakao.maps.Marker({ position });
    marker.setMap(map);
    markersRef.current.push(marker);
    return marker;
  };

  const removeMarkers = () => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  };

  const displayPlaceInfo = (place, map) => {
    const content = `
      <div class="placeinfo">
        <a class="title" href="${place.place_url}" target="_blank">${place.place_name}</a>
        <span>${place.road_address_name || place.address_name}</span>
        <span class="tel">${place.phone || ""}</span>
      </div>`;
    placeOverlayRef.current.setContent(content);
    placeOverlayRef.current.setPosition(new window.kakao.maps.LatLng(place.y, place.x));
    placeOverlayRef.current.setMap(map);
  };

  return (
    <div>
      <ul id="category">
        {[
          { id: "CS2", name: "편의점" },
          { id: "SW8", name: "지하철역" },
          { id: "CE7", name: "카페" },
          { id: "HP8", name: "병원" },
          { id: "PM9", name: "약국" },
        ].map((category) => (
          <li
            key={category.id}
            id={category.id}
            className={currCategory === category.id ? "on" : ""}
            onClick={() => setCurrCategory(currCategory === category.id ? "" : category.id)}
          >
            {category.name}
          </li>
        ))}
      </ul>
      <div ref={mapRef} style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
};

export default Amenities;
