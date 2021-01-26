import React from "react";
import config from "../config";
import "./Adoption.css";

// Demo Interval helper variables
const exampleNames = ["Rod Farva", "Monty Python", "Jim Taggart", "Superman"];
let exampleIndex = 0;
let nameInterval;
let petInterval;
let petCoin = 1;

export default class Adoption extends React.Component {
  state = {
    currCat: {},
    currDog: {},
    userName: "",
    line: [],
    error: null,
    userTurn: false,
    adoptSuccess: false,
  };

  componentDidMount() {
    this.getCat();
    this.getDog();
    this.getLine();
    petInterval = setInterval(this.intervalPetsDemo, 5000);
    nameInterval = setInterval(this.intervalNamesDemo, 5000);
  }

  componentWillUnmount() {
    clearInterval(nameInterval);
    clearInterval(petInterval);
  }

  //Get the next cat
  getCat = () => {
    this.setState({ error: null });
    const URL = `${config.API_ENDPOINT}/cats`;
    //Fetch Call GET
    return fetch(URL)
      .then((res) => {
        !res.ok
          ? res.json().then((e) => Promise.reject(e))
          : res.json().then((cat) => this.setState({ currCat: cat }));
      })
      .catch((error) => this.setState({ error: error.message }));
  };

  //Get the next dog
  getDog = () => {
    this.setState({ error: null });
    const URL = `${config.API_ENDPOINT}/dogs`;
    //Fetch Call Get
    return fetch(URL)
      .then((res) => {
        !res.ok
          ? res.json().then((e) => Promise.reject(e))
          : res.json().then((dog) => this.setState({ currDog: dog }));
      })
      .catch((error) => this.setState({ error: error.message }));
  };

  //Get the line list for the humany woomany stuff
  getLine = () => {
    this.setState({ error: null });
    const URL = `${config.API_ENDPOINT}/people`;
    //Fetch Call Get
    return fetch(URL)
      .then((res) => {
        !res.ok
          ? res.json().then((e) => Promise.reject(e))
          : res.json().then((line) => this.setState({ line: line }));
      })
      .catch((error) => this.setState({ error: error.message }));
  };

  //Adopt a cat (removing it from the queue)
  adoptCat = () => {
    const URL = `${config.API_ENDPOINT}/cats`;
    //Delete pet since it has been adopted
    return fetch(URL, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => (!res.ok ? res.json().then((e) => Promise.reject(e)) : 1))
      .then(() => this.getCat())
      .then(() => this.removeName())
      .catch((error) => this.setState({ error: error.message }));
  };

  //Adopt a dog (removing it from the queue)
  adoptDog = () => {
    const URL = `${config.API_ENDPOINT}/dogs`;
    //Fetch DELETE since pet is no longer available
    return fetch(URL, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => (!res.ok ? res.json().then((e) => Promise.reject(e)) : 1))
      .then(() => this.getDog())
      .then(() => this.removeName())
      .catch((error) => this.setState({ error: error.message }));
  };

  //HELPERS

  removeName = () => {
    const URL = `${config.API_ENDPOINT}/people`;
    return fetch(URL, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => (!res.ok ? res.json().then((e) => Promise.reject(e)) : 1))
      .then(() => this.getLine())
      .catch((error) => this.setState({ error: error.message }));
  };

  addName = (name) => {
    const URL = `${config.API_ENDPOINT}/people`;
    return fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name }),
    })
      .then((res) => (!res.ok ? res.json().then((e) => Promise.reject(e)) : 1))
      .then(() => this.getLine())
      .then(() => this.setState({ userName: name }))
      .catch((error) => {
        console.error({ error });
      });
  };

  exampleAdd = () => {
    if (exampleIndex >= exampleNames.length) {
      exampleIndex = 0;
    }
    const URL = `${config.API_ENDPOINT}/people`;
    return fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: exampleNames[exampleIndex] }),
    })
      .then((res) => (!res.ok ? res.json().then((e) => Promise.reject(e)) : 1))
      .then(() => this.getLine())
      .then(() => exampleIndex++)
      .catch((error) => {
        console.error({ error });
      });
  };

  turnCheck = () => {
    if (this.state.line[0] === this.state.userName) {
      return this.setState({ userTurn: true });
    } else {
      return this.setState({ userTurn: false });
    }
  };

  //Interval logic
  intervalNamesDemo = () => {
    if (this.state.line.length >= 6) {
      return;
    } else {
      this.exampleAdd();
    }
  };
  intervalPetsDemo = () => {
    this.turnCheck();
    if (this.state.userTurn) {
      return;
    } else {
      if (petCoin === 1) {
        this.adoptCat();
        return (petCoin = 2);
      } else if (petCoin === 2) {
        this.adoptDog();
        petCoin = 1;
      }
    }
  };

  //Click Handler
  handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target["nameInput"].value;
    this.setState({ userName: name });
    this.addName(name);
    document.forms["nameForm"].reset();
  };
  handleDogClick = (e) => {
    e.preventDefault();
    this.adoptDog();
    this.setState({ adoptSuccess: true }, () =>
      setTimeout(() => {
        this.setState({ adoptSuccess: false });
      }, 3000)
    );
    this.setState({ userTurn: false, userName: "" });
    this.removeName();
  };
  handleCatClick = (e) => {
    e.preventDefault();
    this.adoptCat();
    this.setState({ adoptSuccess: true }, () =>
      setTimeout(() => {
        this.setState({ adoptSuccess: false });
      }, 3000)
    );
    this.setState({ userTurn: false, userName: "" });
    this.removeName();
  };

  render() {
    const {
      currCat,
      currDog,
      line,
      error,
      userTurn,
      userName,
      adoptSuccess,
    } = this.state;
    return (
      <section id="adopt">
        <div className="petInfo">
          {/* Render Cats */}
          {currCat ? (
            <div className="pets">
              <img src={currCat.imageURL} alt={currCat.imageDescription}></img>
              <h2>{currCat.name}</h2>
              <ul className="props">
                <li>{currCat.breed}</li>
                <li>{currCat.gender}</li>
                <li>{currCat.age}</li>
                <li>{currCat.story}</li>
              </ul>
              {!userTurn ? (
                <button
                  className="adoptBtn"
                  onClick={this.handleCatClick}
                  disabled
                >
                  Adopt
                </button>
              ) : (
                <button className="adoptBtn" onClick={this.handleCatClick}>
                  Adopt
                </button>
              )}
            </div>
          ) : (
            <h1>No more cats!</h1>
          )}
          {/* Render Dogs*/}
          {currDog ? (
            <div className="pets">
              <img src={currDog.imageURL} alt={currDog.imageDescription}></img>
              <h2>{currDog.name}</h2>
              <ul className="props">
                <li>{currDog.breed}</li>
                <li>{currDog.gender}</li>
                <li>{currDog.age}</li>
                <li>{currDog.story}</li>
              </ul>
              {!userTurn ? (
                <button
                  className="adoptBtn"
                  onClick={this.handleDogClick}
                  disabled
                >
                  Adopt
                </button>
              ) : (
                <button className="adoptBtn" onClick={this.handleDogClick}>
                  Adopt
                </button>
              )}
            </div>
          ) : (
            <h1>No more dogs!</h1>
          )}
        </div>
        {adoptSuccess ? (
          <div className="confirmation">Thanks for your adoption!!!</div>
        ) : (
          <></>
        )}
        {/*Render Line */}
        <div className="line">
          <h3>Queue</h3>
          {userName !== "" ? (
            <>{userTurn ? <h3>Your Up!</h3> : <h3>Wating...</h3>}</>
          ) : (
            <form name="nameForm" onSubmit={this.handleSubmit}>
              <h2>Add your name to the queue!</h2>
              <input
                type="text"
                name="nameInput"
                className="nameInput"
                placeholder="Enter name"
              />
              <button className="submit" type="submit" name="nameSubmit">
                Submit
              </button>
            </form>
          )}
          <p className="currentUser">Current User: {userName}</p>
          <p className="currentUser">Next in line</p>
          <ul className="queue">
            {line.map((person, key) => {
              return (
                <li className="lineItem" key={key}>
                  {person}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="error">
          {error ? <h2>{error.message}</h2> : <p>Enjoy!</p>}
        </div>
      </section>
    );
  }
}
