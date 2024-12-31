import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";  // axiosInstance import

function Test() {
  const [test, setTest] = useState(null);  // test 상태 관리

  useEffect(() => {
    // 서버에서 데이터 요청
    axiosInstance
      .get('/hanbit/test')  // 서버의 '/hanbit/test' 엔드포인트로 GET 요청
      .then((response) => {
        if (response.status === 200) {  // 응답이 200이면 데이터 처리
          console.log(response.data);  // 콘솔에 데이터 출력
          setTest(response.data);  // 받은 데이터로 상태 업데이트
        }
      })
      .catch((error) => {
        console.error("An error:", error);  // 에러 발생 시 처리
      });
  }, []);  // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때만 실행되도록 함

  return (
    <h1>
      {test || 'Loading...'}  {/* test 상태가 null일 경우 'Loading...' 표시 */}
    </h1>
  );
}

export default Test;
