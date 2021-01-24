import React from "react";
import { Route, Link } from "react-router-dom";
import Landing from "../Landing/Landing";
import Adoption from "../Adoption/Adoption";

export default class App extends React.Component {
  render() {
    return (
      <>
        <header>
          <h1>
            <Link className="home-link" to="/">
              PETFUL
            </Link>
          </h1>
        </header>
        <div className="App">
          <Route exact path={"/"} component={Landing} />
          <Route exact path={"/adopt"} component={Adoption} />
        </div>
      </>
    );
  }
}
