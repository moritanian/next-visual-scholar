import { createReducer } from 'redux-act';
import {
  CLICK_ARTICLE_ACTION
} from './../actions/GetAction'

const initalState = {
  articleData: null
};

const article = (state = [initalState], action) => {    
  switch (action.type) {
    case CLICK_ARTICLE_ACTION:
        return [
          ...state,
            {
                articleData : action.data
            }
          ];
      break;
    default:
      return state
  }
};

export default article;
