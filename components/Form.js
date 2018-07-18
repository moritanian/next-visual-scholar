import React from 'react';
import { connect } from 'react-redux';
import { GET_POSTS_REQUEST,getPostsRequest, getPosts }  from '../actions/GetAction';

class Form extends React.Component {
  render() {
    return (
      <div>
        <h2>Form</h2>
        <button onClick={() => {console.log(this); getPosts()(this.props.dispatch, '14804188782990544648') }} > GetItem</button>
      </div>
    );
  }
}

function mapStateToProps({ counter }) {
  return { counter };
}

export default connect(mapStateToProps)(Form);
//export default Form;
