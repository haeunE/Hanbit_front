import { useEffect, useState } from "react";

function FineDustGraph(){
  const [data, setData] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState("CO");

  useEffect(()=>{
    const KEY = import.meta.env.VITE_KOREA_SEOUL_DATA_API_KEY;
    const dates = generateDates();
    const fetchedDate = [];

    dates.forEach((date)=>{
      const URL =  `http://openAPI.seoul.go.kr:8088/${KEY}/json/TimeAverageAirQuality/1/1000/${date}`;

      fetch(URL)
        .then((response)=>response.json())
        .then((data)=>{
          
        })
    })

  })
  function generateDates(){
    const dates = [];
    const now = new Date();
    for(let i=0; i < 24; i++){
      const date = new Date(now);
      date.setHours(now.getHours()-i);
      const formattedDate = 
        date.getFullYear().toString()+
        (date.getMonth()+1).toString().padStart(2, "0") +
        date.getDate().toString().padStart(2, "0") + 
        date.getHours().toString().padStart(2, "0") + 
        "00";
      dates.push(formattedDate);  
    }
    return dates;
  }
}