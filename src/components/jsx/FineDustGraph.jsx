import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "../css/FineDustGraph.css";
import dayjs from "dayjs"; // dayjs 라이브러리 임포트
<<<<<<< HEAD
import { useDispatch } from "react-redux";
import { uploadAir } from "../../redux/weatherFuture";
=======
import { useDispatch, useSelector } from "react-redux";
import { SetIsMode } from "../../redux/modeState";
>>>>>>> 7062a628959f4f1e56a7a7d616f17284bb83639a

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function FineDustGraph() {
  const [data, setData] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState("CO");
  const location = JSON.parse(localStorage.getItem("location"));
<<<<<<< HEAD
  const dispatch = useDispatch();
=======
  const isMode = useSelector((state) => state.isMode);
  const dispatch = useDispatch();

>>>>>>> 7062a628959f4f1e56a7a7d616f17284bb83639a

  useEffect(() => {
    const KEY = import.meta.env.VITE_KOREA_SEOUL_DATA_API_KEY;
    const dates = generateDates();
    let fetchedData = [];

    const savedMode = JSON.parse(localStorage.getItem("isMode"));
    if (savedMode !== null) {
      dispatch(SetIsMode(savedMode));
    }

    // 비동기적으로 데이터를 가져오고 저장
    Promise.all(
      dates.map((date) => {
        const URL = `http://openAPI.seoul.go.kr:8088/${KEY}/json/TimeAverageAirQuality/1/1000/${date}/${location.city}`;
        return fetch(URL)
          .then((response) => response.json())
          .then((data) => {
            if (data && data.TimeAverageAirQuality.row) {
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
            }
          })
          .catch((error) => console.log(error));
      })
    ).then(() => {
      // 데이터를 중복 없이 시간순으로 정렬한 후 한번만 setData 호출
      const sortedData = fetchedData
        .sort((a, b) => {
          const dateA = new Date(
            `${a.time.slice(0, 4)}-${a.time.slice(4, 6)}-${a.time.slice(6, 8)}T${a.time.slice(8, 10)}:${a.time.slice(10, 12)}:00`
          );
          const dateB = new Date(
            `${b.time.slice(0, 4)}-${b.time.slice(4, 6)}-${b.time.slice(6, 8)}T${b.time.slice(8, 10)}:${b.time.slice(10, 12)}:00`
          );
          return dateA - dateB;
        });

      setData(sortedData); // 정렬된 데이터로 상태 설정
      dispatch(uploadAir(sortedData.slice(0, sortedData.length - 6)));

    });
  }, []);

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

  const graphData = {
    labels: data
      .map((entry) => dayjs(entry.time, "YYYYMMDDHHmm").format("HH:mm")), // 시간만 추출
    datasets: [
      {
        label: selectedParameter,
        data: data
          .map((entry) => entry[selectedParameter]), // 선택된 파라미터 데이터
        backgroundColor: isMode
          ? "rgba(75, 192, 192, 0.6)" // mode가 true일 경우
          : "#2f4858", // mode가 false일 경우
        borderColor: isMode
          ? "rgba(75, 192, 192, 1)" // mode가 true일 경우
          : "#2f4858", // mode가 false일 경우
        borderWidth: 1,
      },
    ],
  };
  

  const options = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          autoSkip: false // x축의 레이블이 중복되지 않도록 설정
        },
        grid : {
          display : false
        }
      },y: {
        grid : {
          display : false
        }
      },
    },
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
        <label htmlFor="parameter">그래프 선택 : </label>
        <select id="parameter" value={selectedParameter} onChange={(e) => setSelectedParameter(e.target.value)}>
          <option value="CO">CO</option>
          <option value="SO2">SO2</option>
          <option value="PM10">PM10</option>
          <option value="PM25">PM2.5</option>
          <option value="NO2">NO2</option>
          <option value="O3">O3</option>
        </select>
      </div>

      <div className="graph-container" style={{ width: '90%', height: '500px' }}>
        {data.length > 0 ? <Bar data={graphData} options={options} /> : <p>데이터를 불러오는 중...</p>}
      </div>
    </div>
  );
}

export default FineDustGraph;
