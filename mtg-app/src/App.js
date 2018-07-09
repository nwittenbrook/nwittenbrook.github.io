import React, { Component } from 'react';
import './App.css';
import InfiniteScroll from 'react-infinite-scroller';

class App extends Component {
  constructor(props) {
   super(props);
   this.state = {
      items: 20,
      cards: [],
      page: 1,
      hasMoreItems: true,
      results: null
    };
  }
 
  loadItems(page) {

    // make API request
    fetch("https://api.magicthegathering.io/v1/cards?types=creature&orderBy=name&page=" + page + "&pageSize=20&contains=imageUrl")
      .then(res => res.json())
      .then(
          (result) => {
            // append results to page
            if(this.state.results) {
              result.cards.map((card) => { this.state.cards.push(card); });
              this.setState({
                cards: this.state.cards
              });
            // first API call
            } else {
              this.setState({
                results: true,
                cards: result.cards
              });
            }
            // TODO: error handling
        }
      )
  }

 
  render() {
      // show loading state while API is being called
      const loader =  <p className="loading-text"> Loading...</p>;

      // populate cards - info appears on hover
      var items = [];
      this.state.cards.map((card) => {
        items.push(
          <div className="single-card" key={card.id}>
            <div className="hover-content">
              <h2 className="card-title">{card.name}</h2>
              <dl>
                <dt>Artist</dt>
                <dd>{card.artist}</dd>
                <dt>Set Name</dt>
                <dd>{card.setName}</dd>
                <dt>Original Type</dt>
                <dd>{card.originalType}</dd>
              </dl>
            </div>
            <img className="card-image" src={card.imageUrl} alt={card.name} />
          </div>
        )
      });

      return (
              <InfiniteScroll
                  pageStart={0}
                  loadMore={this.loadItems.bind(this)}
                  hasMore={this.state.hasMoreItems}
                  loader={loader}>

                    <div ref="scrollArea" className="page-container">
                      <SearchBox search={this.search} />
                      <header>
                        <h1 className="page-header">Magic the Gathering: Creature Cards</h1>
                        <p className="page-description">Cards are sorted in alphabetical order. Hover over a card to see additional details.</p>
                      </header>
                      
                      <div className="card-container">
                      {items}
                      </div>
                    </div>
              </InfiniteScroll>
      );
   }
};


// search for a card
class SearchBox extends Component {

    constructor(props) {
     super(props);
     this.state = {
        input: ""
      };
    }

    handleChange(e) {
      this.setState({ input: e.target.value });
    }

    loadResults() {
      const mtg = require('mtgsdk');
      let query    = this.state.input;
      mtg.card.all({ name: query, pageSize: 1 })
      .on('data', card => {
          this.state.cards.push(card);
      });
      this.setState({
          cards: this.state.cards
      });
    }
    // TODO: Actually update the page...
    
    render() {
        return (
            <div id="search-bar">
                <input type="text" ref="query" onChange={ this.handleChange.bind(this) } />
                <input type="submit" onClick={ this.loadResults.bind(this) } />
            </div>
        );
    }
};

export default App;
