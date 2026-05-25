import { call, delay, put, takeLatest } from 'redux-saga/effects';
import {
  USER_LOGIN,
  USER_GOOGLE_LOGIN,
  USER_LOGIN_REQUEST,
  USER_LOGIN_COMPLETE,
  USER_LOGIN_ERROR,
  USER_LOGIN_CANCEL,
} from './actions';
import { userLogin } from '../api/auth';
import { performNativeGoogleAuth } from '../services/googleAuthFlow';
import { markAuthenticated } from '../services/sessionAuth';

function* loginSaga({ payload }: any): any {
  try {
    yield put({ type: USER_LOGIN_REQUEST });
    const data = yield call(userLogin, payload);
    yield delay(100);
    markAuthenticated();
    yield put({ type: USER_LOGIN_COMPLETE, payload: data });
  } catch (error: any) {
    console.warn('USER_LOGIN_ERROR:', error?.message || error);
    yield put({
      type: USER_LOGIN_ERROR,
      error: error.message || 'Login failed',
    });
  }
}

function* googleLoginSaga({ payload }: any): any {
  const action = payload?.action === 'signup' ? 'signup' : 'login';

  try {
    yield put({ type: USER_LOGIN_REQUEST });
    const nativeResult = yield call(performNativeGoogleAuth, action);

    if ('cancelled' in nativeResult && nativeResult.cancelled) {
      yield put({ type: USER_LOGIN_CANCEL });
      return;
    }

    if ('error' in nativeResult && nativeResult.error) {
      yield put({ type: USER_LOGIN_ERROR, error: nativeResult.error });
      return;
    }

    if ('pending' in nativeResult && nativeResult.pending) {
      yield put({ type: USER_LOGIN_ERROR, error: nativeResult.message });
      return;
    }

    if ('success' in nativeResult && nativeResult.success) {
      markAuthenticated();
      yield delay(150);
      yield put({
        type: USER_LOGIN_COMPLETE,
        payload: { token: nativeResult.token },
      });
      return;
    }

    yield put({ type: USER_LOGIN_ERROR, error: 'Google sign-in failed.' });
  } catch (error: any) {
    console.warn('USER_GOOGLE_LOGIN_ERROR:', error?.message || error);
    yield put({
      type: USER_LOGIN_ERROR,
      error: error?.message || 'Google sign-in failed',
    });
  }
}

export default function* rootSaga(): any {
  yield takeLatest(USER_LOGIN as any, loginSaga as any);
  yield takeLatest(USER_GOOGLE_LOGIN as any, googleLoginSaga as any);
}
