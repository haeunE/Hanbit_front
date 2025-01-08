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
```

# 날씨 API 설정
날씨 정보에 관한 API를 이용하여 정보를 가져오는 기능 수행하기 위해 아래 방법을 진행하셔야 합니다.

## 날씨 API 생성 및 설정
1. https://home.openweathermap.org/users/sign_in 로그인
2. https://home.openweathermap.org/api_keys 에서 api정보 복사

## .env.local 파일에 api 정보 넣기
```
VITE_WEATHER_API_KEY=your_api_key
```

# 인구밀집도 (Population) API
POPULATION_MAP_API_URL=https://data.seoul.go.kr/SeoulRtd/
POPULATION_MAP_API_KEY=your_api_key