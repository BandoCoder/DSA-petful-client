//USER STORY #1
import React from "react";
import { Link } from "react-router-dom";

import "./Landing.css";

export default function Landing() {
  <section className="landing">
    <h1>WELCOME TO PETFUL</h1>
    <h2>Adopt a pet</h2>
    <p>
      We will help you adopt a pet. When you enter your name your placed in a
      queue, when its your turn you will be able to adopt a pet. You can only
      adopt the pet who has been inside this computer the longest.
    </p>
    <h2>
      <Link className="start" to="/adopt">
        GET STARTED
      </Link>
    </h2>
  </section>;
}
