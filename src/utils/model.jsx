import axios from "axios";
import { useDispatch } from "react-redux";

const weatherModel = async () => {
    try {
        const city = JSON.parse(localStorage.getItem("location"))?.region?.split(" ")[0];
        
        // 올바르게 객체를 전달
        const response = await axios.post("http://localhost:5000/dust/hour", {
            city: city, // 변환된 데이터 전송
        });

        console.log("PM10 Prediction:", response.data.pm10[0]);
        // console.log("PM2.5 Prediction:", response.data.pm25);

        const result = await response.data.pm10[0];

        return result; // 예측 결과 반환
    } catch (error) {
        console.error("Error fetching prediction:", error);
        return null;
    }
};

export default weatherModel;
