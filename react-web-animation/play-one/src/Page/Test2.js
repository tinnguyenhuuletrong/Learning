import React, {
  useRef,
  useState,
  useReducer,
  useEffect,
  useLayoutEffect,
} from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import { blue, green } from "@material-ui/core/colors";

import { useSpring, useSprings, animated, interpolate } from "react-spring";
import { useDrag } from "react-use-gesture";

function swap(arr, i, j) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
  return arr;
}
function clamp(v, min, max) {
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

function contain(cx, cy, { x, y, width, height }) {
  return x <= cx && cx <= x + width && y <= cy && cy <= y + height;
}

const Styles = {};
const Card = ({
  id,
  dispatch,
  animatedValues: { x, y, zIndex },
  dragProps,
}) => {
  const ref = useRef(null);
  const itemRef = useRef(null);

  useLayoutEffect(() => {
    dispatch({
      type: "updateBoundRect",
      id,
      value: ref.current.getBoundingClientRect(),
    });
  }, [dispatch, id]);

  return (
    <>
      <div
        ref={ref}
        style={{
          ...Styles.cardBase,
          ...Styles.hidden,
        }}
      >
        <Paper
          ref={itemRef}
          component={animated.div}
          style={{
            ...Styles.cardBase,
            ...Styles.dragable,
            ...{
              zIndex,
              top: interpolate([y], (y) => `${y}px`),
              left: interpolate([x], (x) => `${x}px`),
            },
          }}
          elevation={3}
          {...dragProps}
        >
          <Grid
            container
            justify="center"
            alignItems="center"
            style={Styles.cardContent}
          >
            <Typography>{id}</Typography>
          </Grid>
        </Paper>
      </div>
    </>
  );
};

const DevFrom = ({ dispatch }) => {
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(1);
  return (
    <>
      <input
        type="text"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />
      <input type="text" value={to} onChange={(e) => setTo(e.target.value)} />
      <button onClick={() => dispatch({ type: "swap", from, to })}>Swap</button>
    </>
  );
};

const fn = (state, down, originalIndex, curIndex, y) => (index) => {
  const posIndex = state.order.indexOf(index);
  const res =
    down && index === originalIndex
      ? {
          x: state.boundRect[curIndex]?.x || 0,
          y: state.boundRect[curIndex]?.y || 0,
          zIndex: "1",
          immediate: (n) => n === "y" || n === "zIndex",
        }
      : {
          x: state.boundRect[posIndex]?.x || 0,
          y: state.boundRect[posIndex]?.y || 0,
          zIndex: "0",
          immediate: false,
        };
  // console.log(state.boundRect, index, res);
  return res;
};

function reducer(state, action) {
  switch (action.type) {
    case "updateBoundRect":
      state.boundRect[action.id] = action.value;
      return { ...state };
    case "swap": {
      swap(state.order, action.from, action.to);
      return { ...state };
    }
    case "setOrder": {
      state.order = action.value;
      return { ...state };
    }
    default:
      throw new Error();
  }
}
const initialState = {
  boundRect: {},
};

function calculateNewIndex(state, x, y) {
  const index = Object.keys(state.boundRect).findIndex((_, index) => {
    return state.boundRect && contain(x, y, state.boundRect[index]);
  });
  return index;
}

const Test1 = ({ items = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }] }) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...{ items, order: items.map((_, index) => index) },
  });
  const [springs, setSprings] = useSprings(items.length, fn(state));
  // const bind = useDrag(({ args: [originalIndex], down, delta: [x, y] }) => {
  //   const curIndex = state.order.indexOf(originalIndex);
  //   const curRow = calculateNewIndex(state, x, y);
  //   const newOrder = swap(state.order, curIndex, curRow);
  //   setSprings(fn(state, down, originalIndex, curIndex, y));
  //   if (!down) dispatch({ type: "setOrder", value: newOrder });
  // });

  useEffect(() => {
    setSprings(fn(state));
  }, [setSprings, state]);

  window.state = state;
  window.dispatch = dispatch;

  return (
    <>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={Styles.container}
      >
        {springs.map(({ zIndex, x, y }, index) => (
          <Card
            key={items[index].id}
            id={index}
            state={state}
            dispatch={dispatch}
            animatedValues={{ zIndex, x, y }}
            // dragProps={bind(index)}
          />
        ))}
      </Grid>
      <pre>{`dispatch({type:'swap', from: 0, to: 3})`}</pre>
      <DevFrom dispatch={dispatch} />
    </>
  );
};

Styles.container = { background: blue[50], padding: 20 };

/** @type {React.CSSProperties} */
Styles.cardBase = {
  width: 100,
  height: 100,
  margin: "32px 32px 32px 32px",
};

/** @type {React.CSSProperties} */
Styles.hidden = {
  visibility: "hidden",
};

/** @type {React.CSSProperties} */
Styles.dragable = {
  position: "absolute",
  willChange: "transform, background",
  visibility: "visible",
  margin: "auto",
};

Styles.cardContent = {
  userSelect: "none",
  height: "100%",
};

export default Test1;
