import axios from "axios";

const fetchPrediction = async (pastData) => {
    try {
      console.log(pastData)
      // 6시간 데이터를 하나의 객체로 변환
      const flattenedData = pastData.reduce((acc, cur, i) => {
          Object.keys(cur).forEach((key) => {
              acc[`${key}_lag${6 - i}`] = cur[key];
          });
          return acc;
      }, {});
      console.log(flattenedData)
      const response = await axios.post("http://localhost:5000/dust/hour", {
          features: flattenedData, // 변환된 데이터 전송
      });

      console.log("PM10 Prediction:", response.data.pm10);
      console.log("PM2.5 Prediction:", response.data.pm25);

      return response.data; // 예측 결과 반환
    } catch (error) {
        console.error("Error fetching prediction:", error);
        return null;
    }
};

export default fetchPrediction;
