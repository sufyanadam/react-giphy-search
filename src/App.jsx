import React, { Component } from 'react';
import './App.css';
import ImageCollection from './ImageCollection';
import PaginationControls from './PaginationControls';

class App extends Component {
  constructor(props) {
    super(props);

    this.GIPHY_API_KEY          = process.env.REACT_APP_GIPHY_API_KEY;
    this.GIPHY_SEARCH_URL       = `//api.giphy.com/v1/gifs/search?api_key=${this.GIPHY_API_KEY}&q=`;
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
        <PaginationControls
          visible={this.state.images.length > 0}
          currentPage={Math.ceil((this.state.offset + 1) / this.state.perPage, 10)}
          pageCount={parseInt(this.state.totalCount  / this.state.perPage, 10)}
          onNextPageClicked={this.onNextPageClicked.bind(this)}
          onPreviousPageClicked={this.onPreviousPageClicked.bind(this)}
        >
        </PaginationControls>
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
        const newState  = this.determineNewState(terms, json);
        this.cache[url] = newState;
        this.setState(newState);
      });
  }

  getPaginationDataFrom(apiResponse) {
    return {
      perPage:     apiResponse.count,
      totalCount:  apiResponse.total_count,
      offset:      apiResponse.offset,
    };
  }

  determineNewState(terms, apiResponse) {
    const paginationData = this.getPaginationDataFrom(apiResponse.pagination);
    const images         = this.extractImageUrlsFrom(apiResponse.data);

    return Object.assign(
      {searchTerms: terms, images: images},
      paginationData
    );
  }

  extractImageUrlsFrom(apiResponse) {
    return apiResponse.map((image, index) => {
      return image.images.fixed_width.url;
    });
  }

  onPreviousPageClicked(e) {
    let newOffset = this.state.offset - this.state.perPage;
    this.search(this.state.searchTerms, newOffset);
  }

  onNextPageClicked(e) {
    let newOffset = this.state.offset + this.state.perPage;
    this.search(this.state.searchTerms, newOffset);
  }
}

export default App;
