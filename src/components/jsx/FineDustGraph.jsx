import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "../css/FineDustGraph.css";

// Chart.js 설정
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function FineDustGraph() {
  const [data, setData] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState("CO"); // 기본 선택 항목: CO

  useEffect(() => {
    const KEY = import.meta.env.VITE_KOREA_SEOUL_DATA_API_KEY;
    
    // 날짜 생성 함수
    function generateDates() {
      const dates = [];
      const now = new Date();
      for (let i = 0; i < 24; i++) {
        const date = new Date(now);
        date.setHours(now.getHours() - i);
        const formattedDate =
          date.getFullYear().toString() +
          (date.getMonth() + 1).toString().padStart(2, "0") +
          date.getDate().toString().padStart(2, "0") +
          date.getHours().toString().padStart(2, "0") +
          "00";
        dates.push(formattedDate);
      }
      return dates;
    }

    const dates = generateDates();

    // API 호출
    const fetchedData = [];
    dates.forEach((date) => {
      const URL = `http://openAPI.seoul.go.kr:8088/${KEY}/json/TimeAverageAirQuality/1/1000/${date}`;

      fetch(URL)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.TimeAverageAirQuality && data.TimeAverageAirQuality.row) {
            const rows = data.TimeAverageAirQuality.row;
            rows.forEach((entry) => {
              fetchedData.push({
                CO: entry.CO,
                SO2: entry.SO2,
                NO2: entry.NO2,
                O3: entry.O3,
                PM10: entry.PM10,
                PM25: entry.PM25,
                time: entry.MSRDT,
                region: entry.MSRSTE_NM,
              });
            });
            setData(fetchedData); // 데이터를 상태로 저장
          }
        })
        .catch((error) => console.error("API 호출 오류:", error));
    });
  }, []);

  // 선택된 파라미터에 따른 그래프 데이터 설정
  const graphData = {
    labels: data.map((entry) => entry.time), // 시간
    datasets: [
      {
        label: selectedParameter, // 선택된 파라미터
        data: data.map((entry) => entry[selectedParameter]), // 선택된 파라미터의 값
        backgroundColor: "rgba(75, 192, 192, 0.6)", // 막대 그래프 색상
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // 그래프 옵션 설정
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${selectedParameter} 막대 그래프`,
      },
    },
  };

  return (
    <div className="fineDustGraph">
      <div className="parameter-select">
        <label htmlFor="parameter">그래프 선택: </label>
        <select
          id="parameter"
          value={selectedParameter}
          onChange={(e) => setSelectedParameter(e.target.value)}
        >
          <option value="CO">CO</option>
          <option value="SO2">SO2</option>
          <option value="PM10">PM10</option>
          <option value="PM25">PM2.5</option>
          <option value="NO2">NO2</option>
          <option value="O3">O3</option>
        </select>
      </div>
      
      <div className="graph-container">
        {data.length > 0 ? (
          <Bar data={graphData} options={options} />
        ) : (
          <p>데이터를 불러오는 중...</p>
        )}
      </div>
    </div>
  );
}

export default FineDustGraph;
