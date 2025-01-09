# React 초기 설정
## react start
```
npm install
npm run dev
```

## .env.local 파일 생성
앱폴더에 .env.local 파일 생성 후 해당 코드 넣어주세요
```
VITE_REACT_APP_SERVER_URL=http://localhost:8888
VITE_WEATHER_API_KEY=your_api_key
VITE_KOREA_TOURIST_DAY_API_KEY = your_api_key
```

# 날씨 API 설정
날씨 정보에 관한 API를 이용하여 정보를 가져오는 기능 수행하기 위해 아래 방법을 진행하셔야 합니다.

## 날씨 API 생성 및 설정
1. https://home.openweathermap.org/users/sign_in 로그인
2. https://home.openweathermap.org/api_keys 에서 api정보 복사

# 인구밀집도 API 설정
인구밀집도를 가져오는 기능을 수행하기 위해 아래 방법을 진행하셔야 합니다.
1. https://data.seoul.go.kr/ 서울 열린데이터광장 로그인
2. https://data.seoul.go.kr/dataList/OA-21778/F/1/datasetView.do 에서 api 키 발급
3. .env 파일에 발급받은 api 키 입력 -> POPULATION_MAP_API_KEY=your_api_key

# 네이버 지도 API 생성 및 설정
1. ncloud (https://www.ncloud.com/) 가입 후 로그인, 카드 등록
2. AI·NAVER API 1에서 API 발급
3. Application 생성 버튼 누르기
  - Maps 전체 선택
  - Application 이름 : hanbit
  - Web 서비스 URL(최대 10개) : http://localhost:5173/, http://localhost:8888/ 넣어주기
4. .env 파일에 발급받은 api 키 입력
  - VITE_NAVER_MAP_CLIENT_ID=your_api_key
  - VITE_NAVER_MAP_CLIENT_SECRET=your_api_key

# 관광정보 API 설정
한국 관광정보에 관한 API를 이용하여 한국 관광 정보를 가져오는 기능을 수행하기 위해 아래 방법을 진행하셔야 합니다.

## 관광정보 API 생성 및 설정
1. https://www.data.go.kr/index.do 로그인
2. https://www.data.go.kr/data/15101578/openapi.do, https://www.data.go.kr/data/15101753/openapi.do 활용신청 누르기
3. 마이페이지 개인 API인증키 인증키 복사