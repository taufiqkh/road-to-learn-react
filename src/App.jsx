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

const Table = ({ list, pattern }) =>
  (
    <div>
      { list.filter(isSearched(pattern)).map(item =>
        <div key={item.objectID}>
          <span><a href={item.url}>{item.title}</a></span>
          <span>{item.author}</span>
          <span>{item.numComments}</span>
          <span>{item.points}</span>
        </div>,
      )}
    </div>
  );

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: REPO_LIST,
      query: '',
    };

    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onSearchChange(event) {
    this.setState({ query: event.target.value });
  }

  render() {
    const { query, list } = this.state;

    return (
      <div className="App">
        <Search value={query} onChange={this.onSearchChange}>
          Search
        </Search>
        <Table list={list} pattern={query} />
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
