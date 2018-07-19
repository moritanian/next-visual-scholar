import { Provider } from 'react-redux';
import Layout from '../components/Layout.js';
import Tree from '../components/Tree.js';
import Form from '../components/Form.js';
import GetPostList from '../containers/GetPostListContainer';
//import indexStyles from './index.scss';
import configureStore from '../store/configureStore';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux'
import { getPosts } from '../actions/GetAction'

export default class App extends React.Component {
  static async getInitialProps({ req }) {
    const isServer = !!req;
    const store = configureStore(applyMiddleware(thunk, logger), isServer);
    console.log('getInitialProps App is Server ' + isServer);
    
    const ret = await getPosts()(null, '14804188782990544648');
    
    var state = store.getState();
    state.posts[0].items = ret;
    return { initialState: state, isServer };
  }

  constructor(props) {
    super(props);
    this.store = configureStore(props.initialState, props.isServer);
  }

  render() {
    return (
      <Provider store={this.store}>
        <div>
          <Form />
          <GetPostList >
          </ GetPostList >
        </div>
      </Provider>
    );
  }
}

