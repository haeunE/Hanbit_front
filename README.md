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

## .env.local 파일에 api 정보 넣기
```
VITE_KOREA_TOURIST_DAY_API_KEY = your_api_key
```

# 서울 열린데이터 광장 API
서울문화포털에서 제공하는 문화행사 정보입니다.
공연, 행사에 대한 장소, 날짜, 기관명, 이용대상, 이용요금, 출연자, 프로그램 등의 정보를 이용하기 위해 진행하셔야합니다.

## 서울 열린데이터 광장 API 생성 및 설정
1. https://www.seoul.go.kr/main/index.jsp 로그인
2. https://data.seoul.go.kr/dataList/OA-15486/S/1/datasetView.do openAPI에 인증키 신청 눌르기
3. 사용URL : http://localhost:5173/ 다른 정보 입력해서 인증키 발급 받기

## .env.local 파일에 api 정보 넣기
```
VITE_KOREA_SEOUL_DATA_API_KEY = your_api_key
```

# NaverBlog,NaverImg
1. https://developers.naver.com/apps/#/register 에서 어플리케이션 등록 후
2. https://developers.naver.com/apps/#/list 에서 api id와 secret가져오기
```
VITE_NAVER_API_ID=
VITE_NAVER_API_SECRET=
```

# .env.local 파일 
앱폴더에 .env.local 파일 생성 후 해당 코드 넣어주세요
```
VITE_REACT_APP_SERVER_URL=http://localhost:8888
VITE_WEATHER_API_KEY=your_api_key
VITE_KOREA_TOURIST_DAY_API_KEY = your_api_key
VITE_KOREA_Festival_DAY_API_KEY = your_api_key
```
VITE_KOREA_SEOUL_DATA_API_KEY = your_api_key
VITE_NAVER_API_ID=
VITE_NAVER_API_SECRET=
```

