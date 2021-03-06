import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import App from '../src/App';
import { Search, Button, Table, Loading, ButtonWithLoading } from '../src/App';

describe('App', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  test('snapshots', () => {
    const component = renderer.create(
      <App />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Search', () => {
  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Search>Search</Search>, div);
  });

  test('snapshots', () => {
    const component = renderer.create(
      <Search>Search</Search>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Button', () => {
  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Button>Give me more</Button>, div);
  });

  test('snapshot', () => {
    const component = renderer.create(
      <Button>Give me more</Button>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Table', () => {
  const props = {
    sortKey: 'NONE',
    list: [
      { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
      { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' },
    ],
  };

  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Table {...props} />, div);
  });

  it('shows two items in lists', () => {
    const element = shallow(
      <Table {...props} />
    );
    expect(element.find('.table-row').length).toBe(2);
  });

  test('snapshot', () => {
    const component = renderer.create(
      <Table {...props} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

const renderFunc = function itRenders(CompToRender) {
  return () => {
    const div = document.createElement('div');
    ReactDOM.render(<CompToRender />, div);
  };
};

describe('Loading', () => {
  it('renders', renderFunc(Loading));

  test('snapshot', () => {
    const component = renderer.create(
      <Loading />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('ButtonWithLoading', () => {
  it('renders', renderFunc(ButtonWithLoading));

  test('snapshot isLoading', () => {
    const component = renderer.create(
      <ButtonWithLoading isLoading={true} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('snapshot notLoading', () => {
    const component = renderer.create(
      <ButtonWithLoading isLoading={false} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
