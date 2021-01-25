import React from "react";
import config from "../config";

// Demo Interval helper variables
const exampleNames = ["Rod Farva", "Monty Python", "Jim Taggart", "Superman"];
let exampleIndex = 0;
let nameInterval;
let dogInterval;
let catInterval;
let lineCap = 0;
let petCoin = 1;

export default class Adoption extends React.Component {
  state = {
    currCat: {},
    currDog: {},
    currPerson: "",
    userName: "",
    line: [],
    error: null,
    userTurn: false,
  };

  componentDidMount() {
    this.getCat();
    this.getDog();
    this.getLine();
    this.getCurrentName();
    this.intervalNamesDemo();
    this.intervalPetsDemo();
  }

  componentWillUnmount() {
    clearInterval(nameInterval);
    clearInterval(catInterval);
    clearInterval(dogInterval);
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
      .then(() => this.turnCheck())
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
      .then(() => console.log(petCoin))
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

  //Get the current name thats able to adopt a pet
  getCurrentName = () => {
    let currentName = this.state.line[0];
    return this.setState({ currPerson: currentName });
  };

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
      .then(() => this.getCurrentName())
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
      .then(() => (lineCap >= 7 ? (lineCap = 0) : lineCap++))
      .catch((error) => {
        console.error({ error });
      });
  };

  turnCheck = () => {
    if (this.state.currPerson === this.state.userName) {
      return this.setState({ userTurn: true });
    } else {
      return this.setState({ userTurn: false });
    }
  };

  //Interval logic
  intervalNamesDemo = () => {
    if (!this.state.userTurn || lineCap < 7) {
      return (nameInterval = setInterval(() => this.exampleAdd(), 5000));
    } else {
      return clearInterval(nameInterval);
    }
  };
  intervalPetsDemo = () => {
    if (!this.state.userTurn) {
      if (petCoin === 1) {
        clearInterval(dogInterval);
        catInterval = setInterval(() => this.adoptCat(), 5000);
        petCoin = 2;
      } else if (petCoin === 2) {
        clearInterval(catInterval);
        dogInterval = setInterval(() => this.adoptDog(), 5000);
        petCoin = 1;
      }
    } else {
      clearInterval(catInterval);
      clearInterval(dogInterval);
    }
  };

  //Click Handler
  handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target["nameInput"].value;
    this.setState({ userName: name });
    this.addName(name);
  };

  render() {
    const { currCat, currDog, line, error, userTurn, userName } = this.state;
    return (
      <section id="adopt">
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
              <button className="adoptBtn" onClick={this.adoptDog} disabled>
                Adopt
              </button>
            ) : (
              <button className="adoptBtn" onClick={this.adoptDog}>
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
              <button className="adoptBtn" onClick={this.adoptDog} disabled>
                Adopt
              </button>
            ) : (
              <button className="adoptBtn" onClick={this.adoptDog}>
                Adopt
              </button>
            )}
          </div>
        ) : (
          <h1>No more dogs!</h1>
        )}
        {/*Render Line */}
        <div className="line">
          <h3>Queue</h3>
          <p>Current User: {userName}</p>
          <ul>
            {line.map((person, key) => {
              return (
                <li className="lineItem" key={key}>
                  {person}
                </li>
              );
            })}
          </ul>
        </div>
        <form onSubmit={this.handleSubmit}>
          <h2>Add your name to the queue!</h2>
          <label htmlFor="nameInput">Name: </label>
          <input type="text" name="nameInput" className="nameInput" />
          <button type="submit" name="nameSubmit">
            Submit
          </button>
        </form>
        <div className="error">
          {error ? <h2>{error.message}</h2> : <p>Enjoy!</p>}
        </div>
      </section>
    );
  }
}
