import React from "react";
import config from "../config";

const exampleNames = ["Rod Farva", "Monty Python", "Jim Taggart", "Superman"];
let intervalCoin = 1;
let catInterval;
let dogInterval;
let nameInterval;
let exampleIndex = 0;

export default class Adoption extends React.Component {
  state = {
    currCat: {},
    currDog: {},
    currPerson: "",
    userName: "",
    line: [],
    myTurn: false,
    error: null,
  };

  componentDidMount() {
    this.getCat();
    this.getDog();
    this.getLine();
  }

  componentDidUpdate() {
    if (intervalCoin > 2) {
      intervalCoin = 1;
    }
    if (this.currPerson !== this.userName) {
      this.setPetInterval();
      this.setNameInterval();
    } else {
      clearInterval(catInterval);
      clearInterval(dogInterval);
      clearInterval(nameInterval);
    }
  }

  getCat = () => {
    this.setState({ error: null });
    const URL = `${config.API_ENDPOINT}/cats`;

    fetch(URL)
      .then((res) => {
        if (!res.ok) {
          this.setState({ error: res.error });
        }
      })
      .then((cat) => {
        this.setState({ currCat: cat });
      });
  };

  getDog = () => {
    this.setState({ error: null });
    const URL = `${config.API_ENDPOINT}/dogs`;

    fetch(URL)
      .then((res) => {
        if (!res.ok) {
          this.setState({ error: res.error });
        }
      })
      .then((dog) => {
        this.setState({ currDog: dog });
      });
  };

  getLine = () => {
    this.setState({ error: null });
    const URL = `${config.API_ENDPOINT}`;

    fetch(URL)
      .then((res) => {
        if (!res.ok) {
          this.setState({ error: res.error });
        }
      })
      .then((line) => {
        this.setState({ line: line });
        return this.getCurrentName();
      });
  };

  adoptCat = () => {
    const URL = `${config.API_ENDPOINT}/cats`;

    return fetch(URL, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((catAdopted) => {
        this.setState({
          adopts: catAdopted,
          myTurn: false,
        });
        this.removeName();
        return this.getCat();
      });
  };

  adoptDog = () => {
    const URL = `${config.API_ENDPOINT}/dogs`;

    return fetch(URL, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((dogAdopted) => {
        this.setState({
          adopts: dogAdopted,
          myTurn: false,
        });
        this.removeName();
        return this.getdog();
      });
  };

  getCurrentName = () => {
    let currentName = this.state.line[0];
    this.setState({ currPerson: currentName });
  };

  removeName = () => {
    const URL = `${config.API_ENDPOINT}/people`;
    return fetch(URL, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((usedName) => {
        return this.getLine();
      });
  };

  setPetInterval = () => {
    if (intervalCoin === 1) {
      clearInterval(dogInterval);
      catInterval = setInterval(this.adoptCat(), 5000);
      return intervalCoin++;
    } else if (intervalCoin === 2) {
      clearInterval(catInterval);
      dogInterval = setInterval(this.adoptDog(), 5000);
      return intervalCoin--;
    }
  };

  setNameInterval = () => {
    nameInterval = setInterval(this.addName(), 5000);
    return nameInterval;
  };

  addName = () => {
    if (exampleIndex >= exampleNames.length - 1) {
      exampleIndex = 0;
    }
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: exampleNames[exampleIndex],
      }),
    })
      .then((res) => res.json())
      .then((line) => {
        this.setState({
          line: line,
        });
        exampleIndex++;
        return this.getLine();
      });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.line.length >= 5) {
      return this.setState({ error: `Line full please wait` });
    }
    const { name } = e.target;
    const URL = `${config.API_ENDPOINT}/people`;

    return fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.value,
      }),
    })
      .then((res) => res.json())
      .then((line) => {
        this.setState({
          line: line,
        });
        return this.getLine();
      });
  };

  render() {
    return <></>;
  }
}
