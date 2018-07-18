import {connect} from 'react-redux'
import Tree from '../components/Tree'
const mapStateToProps = (state) => {    
  console.log(state);
  const length = state.posts.length
  const currentState = state.posts[length - 1]  // 一番新しいstateを取り出す
  return { posts: currentState.items, first: 2 }  // 描画するのに必要なのはとりあえずitemsだけなのでitemsだけ返す
}

const GetPostList = connect(
  mapStateToProps
)(Tree)

export default GetPostList
