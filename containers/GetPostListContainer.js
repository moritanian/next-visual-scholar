import {connect} from 'react-redux'
import { onClickArticle }  from '../actions/GetAction';
import Tree from '../components/Tree'

const mapStateToProps = (state) => {

	const length = state.posts.length
	const currentState = state.posts[length - 1]  
	
	const articleLength = state.article.length
	const currentArticle = state.article[articleLength - 1]  
	return { posts: currentState.items, currentArticle: currentArticle }  

}

const GetPostList = connect(
	mapStateToProps, {onClickArticle}
)(Tree)

export default GetPostList
