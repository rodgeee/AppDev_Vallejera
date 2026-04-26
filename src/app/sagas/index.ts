import { call, put, takeLatest } from 'redux-saga/effects';
import { USER_LOGIN, USER_LOGIN_REQUEST, USER_LOGIN_COMPLETE, USER_LOGIN_ERROR } from './actions';
import { userLogin } from '../api/auth';

function* loginSaga({ payload }: any): any {
  try {
    yield put({ type: USER_LOGIN_REQUEST });
    const data = yield call(userLogin, payload);
    console.log('USER_LOGIN_COMPLETE:', data);
    yield put({ type: USER_LOGIN_COMPLETE, payload: data });
  } catch (error: any) {
    console.warn('USER_LOGIN_ERROR:', error?.message || error);
    yield put({
      type: USER_LOGIN_ERROR,
      error: error.message || 'Login failed',
    });
  }
}

export default function* rootSaga(): any {
  yield takeLatest(USER_LOGIN as any, loginSaga as any);
}
