"use client";

import style from "./Header.module.css";

const Header = () => {
  return (
    <header className={style.header}>
      <div className={style.container}>
        <img src="/logo.png" alt="Logo" className={style.logo} />
        <div>
          <h1 className={style.title}>PallavAI Call Analyzer</h1>
          <p className={style.subtitle}>AI-powered call insights</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
