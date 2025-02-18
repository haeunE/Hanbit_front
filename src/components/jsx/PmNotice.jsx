import React from "react";

function PmNotice({ cityAir }) {
    let message = "미세먼지 예측 데이터를 불러오는 중입니다.";  // 기본 메시지

    if (cityAir) {
        const pm10 = cityAir.pm10;  // 미세먼지 (PM-10)
        const pm25 = cityAir.pm25;  // 초미세먼지 (PM-2.5)

        // 미세먼지(PM-10) 등급 설정
        if (pm10 <= 30) {
            message = "야외 활동하기 좋은 날씨에요. 미세먼지가 좋음 상태입니다.";
        } else if (pm10 <= 80) {
            message = "미세먼지 농도가 보통이에요. 외출 시 가벼운 활동을 추천합니다.";
        } else if (pm10 <= 150) {
            message = "미세먼지 농도가 나쁩니다. 외출 시 마스크를 착용하세요.";
        } else {
            message = "미세먼지 농도가 매우 나쁩니다. 외출을 자제하세요.";
        }


        // 미세먼지(PM-10) 등급 설정
        if (pm25 <= 15) {
            message = "야외 활동하기 좋은 날씨에요. 미세먼지가 좋음 상태입니다.";
        } else if (pm25 <= 35) {
            message = "미세먼지 농도가 보통이에요. 외출 시 가벼운 활동을 추천합니다.";
        } else if (pm25 <= 75) {
            message = "미세먼지 농도가 나쁩니다. 외출 시 마스크를 착용하세요.";
        } else {
            message = "미세먼지 농도가 매우 나쁩니다. 외출을 자제하세요.";
        }


        return (
            <div>
                <h5>미세먼지 농도 별 행동요령</h5>
                <p>{message}</p>
            </div>
        );
    }
}

export default PmNotice;
