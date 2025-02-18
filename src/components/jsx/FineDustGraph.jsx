import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "../css/FineDustGraph.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function FineDustGraph() {
  const [data, setData] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState("CO");
  const location = JSON.parse(localStorage.getItem("location"));

  useEffect(() => {
    const KEY = import.meta.env.VITE_KOREA_SEOUL_DATA_API_KEY;
    const dates = generateDates();
    const fetchedData = [];

    dates.forEach((date) => {
      const URL = `http://openAPI.seoul.go.kr:8088/${KEY}/json/TimeAverageAirQuality/1/1000/${date}/${location.city}`;

      fetch(URL)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.TimeAverageAirQuality.row) {
            console.log(data)
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
            setData(fetchedData);
          }
        })
        .catch((error) => console.log(error));
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
    labels: data.map((entry) => entry.time).filter((_, index) => index % 3 === 0), // 3시간 간격
    datasets: [
      {
        label: selectedParameter,
        data: data.map((entry) => entry[selectedParameter]).filter((_, index) => index % 3 === 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxTicksLimit: 8,
        },
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

      <div className="graph-container">
        {data.length > 0 ? <Bar data={graphData} options={options} /> : <p>데이터를 불러오는 중...</p>}
      </div>
    </div>
  );
}

export default FineDustGraph;
