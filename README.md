# React 초기 설정

## React 프로젝트 시작
```bash
npm install
npm run dev
```

## .env.local 파일 생성
앱 폴더에 `.env.local` 파일을 생성하고 아래 내용을 추가하세요:
```env
VITE_REACT_APP_SERVER_URL=http://localhost:8888
```

---
# 네이버 API 설정

## 1. 네이버 블로그 및 이미지 API
1. [네이버 개발자센터에서 앱 등록](https://developers.naver.com/apps/#/register)
2. 등록된 앱에서 Client ID와 Secret 확인

### .env.local 파일에 API 정보 추가
```env
VITE_NAVER_API_ID=your_api_id
VITE_NAVER_API_SECRET=your_api_secret
```

## 2. 네이버 지도 API 설정
1. [NCloud 가입 및 로그인](https://www.ncloud.com/)
2. AI·NAVER API에서 Maps 서비스 선택 후 API 발급
3. Application 생성 (이름: hanbit)
   - Web 서비스 URL: `http://localhost:5173/`, `http://localhost:8888/`

### .env.local 파일에 API 정보 추가
```env
VITE_NAVER_MAP_CLIENT_ID=your_client_id
VITE_NAVER_MAP_CLIENT_SECRET=your_client_secret
```

---

# 카카오 지도 API 설정

## 1. Kakao 개발자 설정
1. [Kakao Developers 로그인](https://developers.kakao.com/console/app)
2. 어플리케이션 추가 (앱 이름: hanbit)
3. 앱 설정 > 플랫폼 > Web URL: `http://localhost:5173/`, `http://localhost:8888/`
4. 제품 설정 > 카카오 맵 > ON 설정

### .env.local 파일에 API 정보 추가
```env
VITE_KAKAO_REST_API_KEY=your_kakao_key
```

---
# 기타 API 설정

## 1. 날씨 API 설정
### OpenWeather API 생성 및 설정
1. [OpenWeather 로그인](https://home.openweathermap.org/users/sign_in)
2. [API 키 확인](https://home.openweathermap.org/api_keys) 후 복사

### .env.local 파일에 API 정보 추가
```env
VITE_WEATHER_API_KEY=your_api_key
```

## 2. 관광정보 API 설정
### 한국 관광정보 API 생성 및 설정
1. [공공데이터포털 로그인](https://www.data.go.kr/index.do)
2. [관광정보 API 활용신청](https://www.data.go.kr/data/15101578/openapi.do)
3. 마이페이지에서 인증키 복사

### .env.local 파일에 API 정보 추가
```env
VITE_KOREA_TOURIST_DAY_API_KEY=your_api_key
```

## 3. 인구밀집도 API 설정
### 서울 열린데이터광장 API 생성 및 설정
1. [서울 열린데이터광장 로그인](https://data.seoul.go.kr/)
2. [API 키 발급](https://data.seoul.go.kr/dataList/OA-21778/F/1/datasetView.do)

### .env.local 파일에 API 정보 추가
```env
VITE_POPULATION_API_KEY=your_api_key
```

## 4. 서울 열린데이터 광장 API 설정
### 서울문화포털 API 생성 및 설정
1. [서울 열린데이터광장 로그인](https://www.seoul.go.kr/main/index.jsp)
2. [API 인증키 신청](https://data.seoul.go.kr/dataList/OA-15486/S/1/datasetView.do)

### .env.local 파일에 API 정보 추가
```env
VITE_KOREA_SEOUL_DATA_API_KEY=your_api_key
```

---
# 최종 .env.local 파일 예시
```env
VITE_REACT_APP_SERVER_URL=http://localhost:8888
VITE_WEATHER_API_KEY=your_api_key
VITE_KOREA_TOURIST_DAY_API_KEY=your_api_key
VITE_KOREA_SEOUL_DATA_API_KEY=your_api_key
VITE_NAVER_API_ID=your_api_id
VITE_NAVER_API_SECRET=your_api_secret
VITE_NAVER_MAP_CLIENT_ID=your_client_id
VITE_NAVER_MAP_CLIENT_SECRET=your_client_secret
VITE_KAKAO_REST_API_KEY=your_kakao_key
VITE_POPULATION_API_KEY=your_api_key
```