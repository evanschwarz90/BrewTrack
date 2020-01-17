import React from 'react';
import logo from './android-chrome-192x192.png';
import './App.css';
import $ from 'jquery';
import BreweryCard from './breweryCard';

class App extends React.Component {

  constructor() {
    super();
    // localStorage.removeItem('Boulder');
    let city = localStorage.getItem('brewTrackLastCitySearched') || '';
    // console.log('last city searched: ', city);
    this.state = {city: '', breweries: [], visitedList: (JSON.parse(localStorage.getItem('')) || [])};
    if (city !== '') {
      this.handleSearch(false, city);
    }
  }

  async pushBreweries(city, page = 1) {
    let breweries = [];
    const results = await $.get(`https://api.openbrewerydb.org/breweries?by_city=${city}&per_page=50&page=${page}`);
    breweries = breweries.concat(results);
    if (results.length === 50) {
      let moreBreweries = await this.pushBreweries(city, page + 1);
      breweries = breweries.concat(moreBreweries);
    }
    return breweries;
  }

  handleCardClick(e, id, breweryName) {
    e.preventDefault();
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
    localStorage.setItem(this.state.city, JSON.stringify(visitedList));
    this.setState({visitedList});
  }

  async handleSearch(e, city) {
    if (e) {
      e.preventDefault();
    }
    // let google = window.google;
    if (!city) {
      city = document.getElementById('citySearch').value.toLowerCase();
    }
    localStorage.setItem('brewTrackLastCitySearched', city);
    // console.log('new city: ', city);
    let visitedList = (JSON.parse(localStorage.getItem(city)) || []);
    // console.log('visited list: ', visitedList);
    let breweries = await this.pushBreweries(city);
    // console.log('breweries: ',breweries);
    this.setState({
      city,
      visitedList,
      breweries,
    })
  }

  render() {
    return (
      <div className="App container-fluid">
        <form className="float-right" onSubmit={e => this.handleSearch(e)}>
            <input id="citySearch" type="text" placeholder="Search By City"></input>
            <input type="submit" value="submit"></input>
        </form>
        <div className="App-header row justify-content-center">
            <img src={logo} className="App-logo align-self-center" alt="Brew Track Logo" />
            <div className="App-header-text align-self-center">BrewTrack -- Keep track of the breweries you've visited in any city!</div>
        </div>
          <div className="Unvisited-breweries-section">
            <div className="card-deck">
              {this.state.breweries.map((brewery, i) => {
                let visited = false;
                if (this.state.visitedList.includes(brewery.name)) {
                  visited = true;
                }
                return (<BreweryCard breweryData={brewery} visited={visited} key={i} index={i} handleCardClick={this.handleCardClick.bind(this)} />)
              })}
            </div>
          </div>
        </div>
    );
  }
}

export default App;
