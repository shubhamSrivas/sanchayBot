import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <nav>
    <div className="nav-wrapper">
      <Link to={"/"} className="brand-logo">
        It course
      </Link>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li>
          <Link to={"/shop"}>Shop</Link>
        </li>
        <li>
          <Link to={"./about"}>About Us</Link>
        </li>
      </ul>
    </div>
  </nav>
);

export default Header;
