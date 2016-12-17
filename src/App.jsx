import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = 10;

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_PP = 'hitsPerPage=';

function isSearched(query) {
  return function isQuerySearchedOn(item) {
    return !query || item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;
  };
}

const Search = ({ value, onChange, onSubmit, children }) =>
  (
    <form onSubmit={onSubmit}>
      <input type="text" value={value} onChange={onChange} />
      <button type="submit">{children}</button>
    </form>
  );

const largeColumn = { width: '40%' };
const midColumn = { width: '30%' };
const smallColumn = { width: '15%' };

const Button = ({ onClick, children }) =>
  <button onClick={onClick} type="button">
    {children}
  </button>;

const Table = ({ list }) =>
  (
    <div className="table">
      { list.map(item =>
        <div key={item.objectID} className="table-row">
          <span style={largeColumn}>
            <a href={item.url}>{item.title}</a>
          </span>
          <span style={midColumn}>
            {item.author}
          </span>
          <span style={smallColumn}>
            {item.numComments}
          </span>
          <span style={smallColumn}>
            {item.points}
          </span>
        </div>,
      )}
    </div>
  );

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      query: DEFAULT_QUERY,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  componentDidMount() {
    const { query } = this.state;
    this.fetchSearchTopStories(query);
  }

  onSearchSubmit(event) {
    const { query } = this.state;
    this.fetchSearchTopStories(query, DEFAULT_PAGE);
    event.preventDefault();
  }

  onSearchChange(event) {
    this.setState({ query: event.target.value });
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const oldHits = page === 0 ? [] : this.state.result.hits;
    const updatedHits = [...oldHits, ...hits];
    this.setState({ result: { hits: updatedHits, page } });
  }

  fetchSearchTopStories(query, page = 0, hpp = DEFAULT_HPP) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${query}&${PARAM_PAGE}${page}&${PARAM_PP}${hpp}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result));
  }

  render() {
    const { query, result } = this.state;
    const page = (result && result.page) || 0;

    return (
      <div className="page">
        <div className="interactions">
          <Search value={query} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
            Search
          </Search>
        </div>
        { result && <Table list={result.hits} /> }
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(query, page + 1)}>More</Button>
        </div>
      </div>
    );
  }
}

export default App;
