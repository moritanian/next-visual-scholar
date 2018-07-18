import axios from 'axios';
export const GET_POSTS_REQUEST = 'GET_POSTS_REQUEST'
export const getPostsRequest = () => {
  console.log("request");
  return {
    type: GET_POSTS_REQUEST
  }
}

export const GET_POSTS_SUCCESS = 'GET_POSTS_SUCCESS'
const getPostsSuccess = (json) => {  
  console.log("request success");
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
        if( dispatch )
            dispatch( getPostsRequest() );
        var endPoint = `http://153.127.193.8:8000/api/citations/?cited=${cited}&format=json`;
        console.log(endPoint);
        try {
            const res = await axios.get( endPoint );
            if (dispatch)
                dispatch(getPostsSuccess(res.data));
            return res.data;
        }catch(err){
            console.log(err);
            dispatch(getPostsFailure(err));
        }
    }
}

export {getPosts};

