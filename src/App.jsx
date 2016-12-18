import React, { Component } from 'react';
import { sortBy } from 'lodash';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = 10;

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_PP = 'hitsPerPage=';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

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

const Sort = ({ sortKey, onSort, children }) =>
  <Button onClick={() => onSort(sortKey)}>
    {children}
  </Button>;

const Table = ({ list, sortKey, onSort, isSortReverse }) => {
  const sortedList = SORTS[sortKey](list);
  const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
  return (
    <div className="table">
      <div className="table-header">
        <span style={largeColumn}>
          <Sort sortKey={'TITLE'} onSort={onSort}>Title</Sort>
        </span>
        <span style={midColumn}>
          <Sort sortKey={'AUTHOR'} onSort={onSort}>Author</Sort>
        </span>
        <span style={smallColumn}>
          <Sort sortKey={'COMMENTS'} onSort={onSort}>Comments</Sort>
        </span>
        <span style={smallColumn}>
          <Sort sortKey={'POINTS'} onSort={onSort}>Points</Sort>
        </span>
      </div>
      { reverseSortedList.map(item =>
        <div key={item.objectID} className="table-row">
          <span style={largeColumn}>
            <a href={item.url}>{item.title}</a>
          </span>
          <span style={midColumn}>
            {item.author}
          </span>
          <span style={smallColumn}>
            {item.num_comments}
          </span>
          <span style={smallColumn}>
            {item.points}
          </span>
        </div>,
      )}
    </div>
  );
};

const Loading = () => <div>Loading...</div>;

const withLoading = (Component) => ({ isLoading, ...props }) =>
  isLoading ? <Loading /> : <Component {...props} />;

const ButtonWithLoading = withLoading(Button);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: {},
      query: DEFAULT_QUERY,
      searchKey: '',
      isLoading: false,
      sortKey: 'NONE',
      isSortReverse: false,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onSort = this.onSort.bind(this);
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

  onSort(sortKey) {
    const isSortReverse = sortKey === this.state.sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
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
    const { query, results, searchKey, isLoading, sortKey, isSortReverse } = this.state;
    const page = (results && results[query] && results[query].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search value={query} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
            Search
          </Search>
        </div>
        <Table list={list} sortKey={sortKey} onSort={this.onSort} isSortReverse={isSortReverse} />
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </ButtonWithLoading>
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
  ButtonWithLoading,
};
