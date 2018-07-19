import axios from 'axios';
export const GET_POSTS_REQUEST = 'GET_POSTS_REQUEST'
export const getPostsRequest = () => {
  return {
    type: GET_POSTS_REQUEST
  }
}

export const GET_POSTS_SUCCESS = 'GET_POSTS_SUCCESS'
const getPostsSuccess = (json) => {  
  console.log( `Recived ${json.length} articles`);
  return {
    type: GET_POSTS_SUCCESS,
    posts: json,
    receivedAt: Date.now()
  }
}

export const GET_POSTS_FAILURE = 'GET_POSTS_FAILURE'
const getPostsFailure = (error) => {
  type: GET_POSTS_FAILURE,
  error
}

function getPosts () {
    return async function(dispatch, cited) {
        
        if( dispatch ){
            dispatch( getPostsRequest() );
        }

        var endPoint = `http://127.0.0.1:8000/api/citations/?cited=${cited}&format=json`;
        console.log('Access to : ' + endPoint);
        try {
            const res = await axios.get( endPoint );
            
            if (dispatch){
                dispatch(getPostsSuccess(res.data));
            }
            return res.data;
        }catch(err){
            console.log(err);
            dispatch(getPostsFailure(err));
        }
    }
}

export {getPosts};

export const CLICK_ARTICLE_ACTION = 'CLICK_ARTCILE_ACTION';
export function onClickArticle( data ){
  return {
    type: CLICK_ARTICLE_ACTION,
    data: data
  }
}
