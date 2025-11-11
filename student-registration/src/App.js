import React from "react";
import Header from "./components/Header";
import RegistrationForm from "./components/RegistrationForm";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <RegistrationForm />
      </main>
      <Footer /> 
    </div>
  );
}

export default App;
