import React, { useState } from "react";
import axios from "axios";
import axiosInstance from "../../axiosInstance";

const CsvUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!selectedFile) {
      return;
    }

    // 파일 타입 검사 (CSV 파일만 허용)
    if (selectedFile.type !== "text/csv") {
      alert("CSV 파일만 업로드 가능합니다.");
      return;
    }

    // 파일 크기 검사
    if (selectedFile.size > maxSize) {
      alert("파일 크기가 50MB를 초과할 수 없습니다.");
      return;
    }

    setFile(selectedFile);
    setMessage(""); // 파일 선택 후 메시지 초기화
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("파일을 선택하세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post("/api/admin/csv/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("업로드 성공: " + (response.data.message || "작업이 완료되었습니다.")); // 성공 메시지
      setFile(null); // 업로드 후 파일 상태 리셋
    } catch (error) {
      // 에러 응답 데이터 확인 및 처리
      console.log("Error Response Data:", error.response?.data);

      // 필요한 정보를 추출하여 문자열로 설정
      const errorMessage = error.response?.data?.message || "CSV 업로드 중 오류가 발생했습니다.";
      setMessage(errorMessage);
    }
  };

  return (
    <div style={styles.container}>
      <h1>CSV 파일 업로드</h1>
      <div style={styles.form}>
        <input
          type="file"
          onChange={handleFileChange}
          style={styles.input}
        />
        <button onClick={handleUpload} style={styles.button}>
          업로드
        </button>
      </div>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};


const styles = {
  container: {
    paddingTop: "100px",
    padding: "20px",
    textAlign: "center",
  },
  form: {
    marginTop: "20px",
  },
  input: {
    marginBottom: "10px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "#FFF",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    marginTop: "20px",
    color: "#FF0000",
  },
};

export default CsvUpload;
