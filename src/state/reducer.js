import {
    MOVE_PADDLE1,
    MOVE_PADDLE2,
    PADDLE1_SPEED,
    PADDLE2_SPEED,
    MOVE_BALL,
    ADJUST_LIVES
} from "./actions";

export default function reducer (state, action) {
    switch (action.type) {
      case MOVE_PADDLE1:
        return { ...state, paddle1y: action.payload }
      case MOVE_PADDLE2:
        return { ...state, paddle2y: action.payload }
      case PADDLE1_SPEED:
        return { ...state, paddle1dy: action.payload }
      case PADDLE2_SPEED:
        return { ...state, paddle2dy: action.payload }
      case MOVE_BALL:
        return { ...state, ball: action.payload }
      case ADJUST_LIVES:
        return { ...state, lives: state.lives + action.payload }
      default:
        throw new Error();
    }
  };