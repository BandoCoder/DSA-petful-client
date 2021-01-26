//USER STORY #1
import React from "react";
import { Link } from "react-router-dom";

import "./Landing.css";

export default function Landing() {
  return (
    <section className="landing">
      <h1>Adopt a pet</h1>
      <img className="dog" src="cutedoggie.jpg" alt="Cute Doggie" />
      <p>
        We will help you adopt a pet. When you enter your name your placed in a
        queue, when its your turn you will be able to adopt a pet. You can only
        adopt the pet who has been inside this computer the longest.
      </p>

      <button>
        <Link className="start" to="/adopt">
          GET STARTED
        </Link>
      </button>
    </section>
  );
}
