import React from 'react';
import logo from './android-chrome-192x192.png';
import './App.css';
import $ from 'jquery';
import BreweryCard from './breweryCard';

class App extends React.Component {

  constructor() {
    super();
    // localStorage.removeItem('Boulder');
    this.state = {city: 'Boulder', breweries: [], visitedList: JSON.parse(localStorage.getItem('Boulder'))};
    if (!Array.isArray(this.state.visitedList)) {
      this.state.visitedList = [];
      localStorage.setItem('Boulder', JSON.stringify([]));
    }
    $.get('https://api.openbrewerydb.org/breweries?by_city=boulder')
    .then(breweries => this.setState({breweries}));
  }

  handleCardClick(e, id, breweryName) {
    e.preventDefault();
    console.log('first check of state on click', this.state.visitedList);
    let visitedList = this.state.visitedList.slice();
    let className = document.getElementById(id).className;
    if (!className.includes('bg-success')) {
      className += ' bg-success';
      document.getElementById(id).className = className;
      visitedList.push(breweryName);
    } else {
      className = className.replace(' bg-success', '');
      document.getElementById(id).className = className;
      for (let i = 0; i < visitedList.length; i++) {
        if (visitedList[i] === breweryName) {
          visitedList.splice(i, 1);
          break;
        }
      }
    }
    localStorage.setItem('Boulder', JSON.stringify(visitedList));
    this.setState({visitedList}, () => console.log('after state change', visitedList));
    // const recurseIt = (node) => {
    //   console.log(node);
    //   node.style.background = "rgb(1,1,1)";
    //   let children = node.children;
    //   for (let child of children) {
    //     recurseIt(child);
    //   }
    // }
    // recurseIt(e.target);
  }

  render() {
    return (
      <div className="App container-fluid">
        <div className="App-header row justify-content-center">
            <img src={logo} className="App-logo align-self-center" alt="Brew Track Logo" />
            <div className="App-header-text align-self-center">BrewTrack -- Keep track of the breweries you've visited in Boulder!</div>
        </div>
        {/* <div className="App-body row"> */}
          <div className="Unvisited-breweries-section">
            <div className="card-deck">
              {this.state.breweries.map((brewery, i) => {
                if (brewery.website_url !== '') {
                  let visited = false;
                  if (this.state.visitedList.includes(brewery.name)) {
                    visited = true;
                  }
                  return (<BreweryCard breweryData={brewery} visited={visited} key={i} index={i} handleCardClick={this.handleCardClick.bind(this)} />)
                }
              })}
            </div>
          </div>
          {/* <div className="Brewery-checklist col-2">
            {this.state.breweries.map((brewery, i) => (
              <p>{brewery.name}</p>
            ))}
          </div> */}
        </div>
      // </div>
    );
  }
}

export default App;
