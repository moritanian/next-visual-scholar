import {connect} from 'react-redux'
import { onClickArticle }  from '../actions/GetAction';
import Tree from '../components/Tree'

const mapStateToProps = (state) => {    
	const length = state.posts.length
	const currentState = state.posts[length - 1]  // 一番新しいstateを取り出す
	return { posts: currentState.items, first: 2 }  // 描画するのに必要なのはとりあえずitemsだけなのでitemsだけ返す
}

const GetPostList = connect(
	mapStateToProps, {onClickArticle}
)(Tree)

export default GetPostList
