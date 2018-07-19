import { combineReducers } from 'redux'
import posts from './postReducer'
import article from './articleReducer'
const rootReducer = combineReducers({
  posts, article
})

export default rootReducer
