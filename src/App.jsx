import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const REPO_LIST = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

function isSearched(query) {
  return function isQuerySearchedOn(item) {
    return !query || item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;
  };
}

const Search = ({ value, onChange, children }) =>
  (
    <form>
      {children} <input type="text" value={value} onChange={onChange} />
    </form>
  );

const largeColumn = { width: '40%' };
const midColumn = { width: '30%' };
const smallColumn = { width: '15%' };

const Table = ({ list, pattern }) =>
  (
    <div className="table">
      { list.filter(isSearched(pattern)).map(item =>
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
      list: REPO_LIST,
      query: DEFAULT_QUERY,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  componentDidMount() {
    const { query } = this.state;
    this.fetchSearchTopStories(query);
  }

  onSearchChange(event) {
    this.setState({ query: event.target.value });
  }

  setSearchTopStories(result) {
    this.setState({ result });
  }

  fetchSearchTopStories(query) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${query}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result));
  }

  render() {
    const { query, result } = this.state;

    return (
      <div className="page">
        <div className="interactions">
          <Search value={query} onChange={this.onSearchChange}>
            Search
          </Search>
        </div>
        { result ? <Table list={result.hits} pattern={query} /> : null }
      </div>
    );
  }
}

export default App;
