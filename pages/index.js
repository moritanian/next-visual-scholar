import { Provider } from 'react-redux';
import Layout from '../components/Layout.js';
import Tree from '../components/Tree.js';
import Form from '../components/Form.js';
import GetPostList from 'containers/GetPostListContainer';
import indexStyles from './index.scss';
import configureStore from '../store/configureStore';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux'
import { getPosts } from 'actions/GetAction'

export default class App extends React.Component {
  static async getInitialProps({ req }) {
    const isServer = !!req;
    const store = configureStore(applyMiddleware(thunk, logger), isServer);
    console.log('getInitialProps App');
    
    const ret = await getPosts()();
    
    //return {}
    return { initialState: store.getState(), isServer };
  }

  constructor(props) {
    super(props);
    this.store = configureStore(props.initialState, props.isServer);
    //this.store.dispatch(getPosts())
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

