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

const Loading = () => <div>Loading...</div>;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: {},
      query: DEFAULT_QUERY,
      searchKey: '',
      isLoading: false,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
  }

  componentDidMount() {
    const { query } = this.state;
    this.fetchSearchTopStories(query);
    this.setState({ searchKey: query });
  }

  onSearchSubmit(event) {
    const { query } = this.state;
    if (this.needsToSearchTopStories(query)) {
      this.fetchSearchTopStories(query, DEFAULT_PAGE);
    }
    this.setState({ searchKey: query });
    event.preventDefault();
  }

  onSearchChange(event) {
    this.setState({ query: event.target.value });
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey } = this.state;
    const oldHits = page === 0 ? [] : this.state.results[searchKey].hits;
    const updatedHits = [...oldHits, ...hits];
    this.setState({
      results: { ...this.state.results, [searchKey]: { hits: updatedHits, page } },
      isLoading: false,
    });
  }

  needsToSearchTopStories(query) {
    return !this.state.results[query];
  }

  fetchSearchTopStories(query, page = 0, hpp = DEFAULT_HPP) {
    this.setState({ isLoading: true });

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${query}&${PARAM_PAGE}${page}&${PARAM_PP}${hpp}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result));
  }

  render() {
    const { query, results, searchKey, isLoading } = this.state;
    const page = (results && results[query] && results[query].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search value={query} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
            Search
          </Search>
        </div>
        <Table list={list} />
        <div className="interactions">
          { isLoading ?
              <Loading /> :
              <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>More</Button>
          }
        </div>
      </div>
    );
  }
}

export default App;

export {
  Button,
  Search,
  Table,
  Loading,
};
