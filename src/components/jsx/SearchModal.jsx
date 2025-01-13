import { Modal, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useTranslation } from "react-i18next";
import "@/locales/i18n";
import i18n from 'i18next';  // i18n을 import

function SearchModal({ show, handleClose, handleSearch }) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = () => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);  // 검색어를 부모 컴포넌트로 전달
      handleClose();  // 모달 닫기
    } else {
      alert("검색어를 입력하세요.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>검색</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="searchQuery">
            <Form.Control
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          닫기
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          검색
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SearchModal;
