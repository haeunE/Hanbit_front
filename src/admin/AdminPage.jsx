import React from "react";
import { Outlet, Link } from "react-router-dom";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    paddingTop: "100px"
  },
  header: {
    backgroundColor: "#282c34",
    padding: "1rem",
    color: "white",
  },
  nav: {
    marginTop: "0.5rem",
  },
  link: {
    color: "lightblue",
    textDecoration: "none",
    marginRight: "1rem",
  },
  main: {
    flex: 1,
    padding: "1rem",
  },
};

const AdminPage = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>관리자 페이지</h1>
        <nav style={styles.nav}>
          <Link to="/admin/csv" style={styles.link}>
            장소 CSV 업로드
          </Link>
          <Link to="/admin/place" style={styles.link}>
            장소타입 업로드
          </Link>
          <Link to="/admin/users" style={styles.link}>
            사용자 관리
          </Link>
        </nav>
      </header>
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPage;
