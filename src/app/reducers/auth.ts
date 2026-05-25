import { REHYDRATE } from 'redux-persist';
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_COMPLETE,
  USER_LOGIN_ERROR,
  USER_LOGIN_CANCEL,
  RESET_USER_LOGIN,
} from '../sagas/actions';

const INITIALSTATE = {
  data: null,
  isLoading: false,
  isError: false,
  error: null,
};

export default function reducer(state = INITIALSTATE, action: any) {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return {
        ...state,
        data: null,
        isLoading: true,
        isError: false,
        error: null,
      };

    case USER_LOGIN_COMPLETE: {
      const raw = action.payload;
      const token =
        raw && typeof raw === 'object' && typeof raw.token === 'string' ? raw.token : null;
      return {
        ...state,
        data: token ? { token } : null,
        isLoading: false,
        isError: false,
        error: null,
      };
    }

    case USER_LOGIN_ERROR:
      return {
        ...state,
        data: null,
        isLoading: false,
        isError: false,
        error: action.error || 'Login failed',
      };

    case USER_LOGIN_CANCEL:
      return {
        ...state,
        isLoading: false,
        isError: false,
        error: null,
      };

    case RESET_USER_LOGIN:
      return INITIALSTATE;

    case REHYDRATE: {
      if (action.key !== 'auth' || !action.payload) {
        return state;
      }
      const payload = action.payload as { data?: { token?: string } | null };
      const token =
        payload.data && typeof payload.data.token === 'string' ? payload.data.token : null;
      return {
        data: token ? { token } : null,
        isLoading: false,
        isError: false,
        error: null,
      };
    }

    default:
      return state;
  }
}

