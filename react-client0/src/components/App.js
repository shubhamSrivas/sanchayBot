import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import AboutUs from "./pages/AboutUs";
import Shop from "./shop/Shop";
import Chatbot from "./chatbot/Chatbot";
import Header from "./Header";

const App = () => {
  return (
    // <div className="container">
    <div style={{ backgroundColor: "#4b4745cb" }}>
      <BrowserRouter>
        <div>
          <Header />
          <Route exact path="/" component={Landing} />
          <Route exact path="/about" component={AboutUs} />
          <Route exact path="/shop" component={Shop} />
          <Chatbot />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
