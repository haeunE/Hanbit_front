import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../axiosInstance";

const PlaceUpload = () => {
  const [filteredPlaces, setFilteredPlaces] = useState([]); // 필터링된 장소 목록
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [typeId, setTypeId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");

  const handleSearch = () => {
    if (searchQuery.length > 0) {
      // 검색어가 있을 때만 서버에 요청하여 검색된 장소를 가져옵니다.
      axiosInstance
        .get(`/api/admin/places/serch?query=${searchQuery}`)
        .then((response) => {
          setFilteredPlaces(response.data); // 검색된 장소 목록을 설정
        })
        .catch((error) => {
          console.error("장소 검색 오류:", error);
        });
    } else {
      setFilteredPlaces([]); // 검색어가 비어 있으면 리스트를 비웁니다.
    }
  };

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
    setMessage(""); // 선택된 장소 초기화
  };

  const handleTypeChange = (event) => {
    setTypeId(event.target.value);
  };

  const handleUpload = () => {
    if (!selectedPlace) {
      setMessage("장소를 선택하세요.");
      return;
    }

    if (!typeId) {
      setMessage("장소 타입을 선택하세요.");
      return;
    }

    // 선택된 장소에 타입을 업데이트하고 업로드
    axiosInstance
      .put(`/api/admin/places/${selectedPlace.id}/update`, { typeId })
      .then((response) => {
        setMessage("타입 업데이트 성공!");
      })
      .catch((error) => {
        console.error("타입 업데이트 오류:", error);
        setMessage("타입 업데이트 실패.");
      });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>장소타입 업로드</h1>

      {/* 검색 입력 필드와 버튼 추가 */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="장소 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // 검색어 입력 시 setSearchQuery 호출
          style={styles.searchInput}
        />
        <button
          onClick={handleSearch}
          style={styles.searchButton}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#45a049')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#4CAF50')}
        >
          검색
        </button>
      </div>

      <div style={styles.placeList}>
        <h2>장소 목록</h2>
        <ul>
          {filteredPlaces.length === 0 ? (
            <li>검색 결과가 없습니다.</li>
          ) : (
            filteredPlaces.map((place) => (
              <li
                key={place.id}
                style={styles.placeItem}
                onClick={() => handlePlaceClick(place)}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#f1f1f1')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#fff')}
              >
                {place.title} - {place.addn}
              </li>
            ))
          )}
        </ul>
      </div>

      {selectedPlace && (
        <div style={styles.selectionContainer}>
          <h3>선택된 장소: {selectedPlace.title}</h3>
          <div>
            <label htmlFor="type">장소 타입:</label>
            <select
              id="type"
              value={typeId}
              onChange={handleTypeChange}
              style={styles.select}
            >
              <option value="">타입 선택</option>
              <option value="101">술집</option>
              <option value="102">메이드카페</option>
              <option value="103">클럽</option>
              <option value="104">헌팅포차</option>
              <option value="105">헌팅핫플</option>
              <option value="106">카지노</option>
            </select>
          </div>

          <button
            onClick={handleUpload}
            style={styles.button}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#45a049')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#4CAF50')}
          >
            업로드
          </button>
        </div>
      )}

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    color: '#333',
    fontSize: '32px',
    marginBottom: '20px',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  searchInput: {
    width: '75%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  searchButton: {
    padding: '10px 15px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  searchButtonHover: {
    backgroundColor: '#45a049',
  },
  placeList: {
    marginBottom: '30px',
  },
  placeItem: {
    padding: '10px',
    marginBottom: '8px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  placeItemHover: {
    backgroundColor: '#f1f1f1',
  },
  selectionContainer: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  select: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginBottom: '15px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
  message: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#ff5722',
    marginTop: '20px',
  },
};

export default PlaceUpload;
