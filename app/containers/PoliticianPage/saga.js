/**
 * Gets the repositories of the user from Github
 */

import { call, put, takeLatest, all } from 'redux-saga/effects';

import { getRequest } from 'utils/request';
import {
  GET_AUTO_SUGGESTIONS_REQUEST,
  GET_AUTO_SUGGESTIONS_SUCCESS,
  GET_AUTO_SUGGESTIONS_FAIL,
} from './constants';

/**
 * Github repos request/response handler
 */
export function* getAutoSuggestSaga(action) {
  const { searchValue } = action;
  // Select username from store
  const requestURL = `search?name=${searchValue}`;
  try {
    // Call our request helper (see 'utils/request')
    const suggestions = yield call(getRequest, requestURL);
    yield put({
      type: GET_AUTO_SUGGESTIONS_SUCCESS,
      suggestions: suggestions.result,
    });
  } catch (err) {
    yield put({ type: GET_AUTO_SUGGESTIONS_FAIL, err });
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* rootSaga() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield all([takeLatest(GET_AUTO_SUGGESTIONS_REQUEST, getAutoSuggestSaga)]);
}
