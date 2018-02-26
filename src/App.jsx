import React, { Component } from 'react';
import './App.css';
import ImageCollection from './ImageCollection';

class App extends Component {
  constructor(props) {
    super(props);

    this.GIPHY_API_KEY          = process.env.REACT_APP_GIPHY_API_KEY;
    this.GIPHY_SEARCH_URL       = `http://api.giphy.com/v1/gifs/search?api_key=${this.GIPHY_API_KEY}&q=`;
    this.DEFAULT_PER_PAGE_LIMIT = 24;

    this.state = {
      images: []
    };

    this.cache = {};
  }

  render() {
    const style = {
      button: {
        marginLeft: 10,
        borderRadius: 4,
        width: 30,
        height: 22,
        textTransform: 'uppercase'
      },

      searchResults: {
        width: 800,
        display: 'grid',
        gridTemplateColumns: '100px 100px 100px',
        gridGap: 150,
        margin: '0 auto'
      }
    }
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Search giphy!</h1>
          <input type="text" placeholder="search terms" onKeyUp={this.onKeyUp.bind(this)} />
          <button style={style.button} onClick={this.onSearchClicked.bind(this)}>go</button>
        </header>
        <div style={style.searchResults}>
          <ImageCollection images={this.state.images}></ImageCollection>
        </div>
      </div>
    );
  }

  onKeyUp(e) {
    let terms = e.target.value;

    if (e.key === "Enter") return this.search(terms);

    this.setState({terms: terms});
  }

  onSearchClicked(e) {
    this.search(this.state.terms);
  }

  search(terms, offset = 0) {
    if (!terms) return;

    const url           = this.GIPHY_SEARCH_URL + encodeURI(terms) + `&limit=${this.DEFAULT_PER_PAGE_LIMIT}&offset=${offset}`;
    const alreadyCached = this.cache[url];

    if (alreadyCached) {
      this.setState(this.cache[url]);
      return;
    }

    fetch(url)
      .then(response => { return response.json() })
      .then(json     => {
        const newState = this.determineNewState(terms, json);
        this.cache[url] = newState;
        this.setState(newState);
      });
  }

  determineNewState(terms, apiResponse) {
    const images = this.extractImageUrlsFrom(apiResponse.data);

    return Object.assign(
      {searchTerms: terms, images: images},
    );
  }

  extractImageUrlsFrom(apiResponse) {
    return apiResponse.map((image, index) => {
      return image.images.fixed_width.url;
    });
  }
}

export default App;
