import React, { useRef, useState, useLayoutEffect, useMemo } from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import { blue, green } from "@material-ui/core/colors";

import { useSpring, animated, interpolate } from "react-spring";
import { useDrag } from "react-use-gesture";
import useKeyPress from "../useKeyPress";

function swap(arr, i, j) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
  return arr;
}

function contain(cx, cy, { x, y, width, height }) {
  return x <= cx && cx <= x + width && y <= cy && cy <= y + height;
}

const Styles = {};
const Card = ({ id, index, context }) => {
  const [{ x, y, distance }, set] = useSpring(() => ({
    x: 0,
    y: 0,
    distance: 0,
  }));
  const [isDown, setIsDown] = useState(false);
  const ref = useRef(null);
  const dragHandler = useDrag(
    ({ down, values, movement: [mx, my], distance, cancel }) => {
      setIsDown(down);
      set({
        x: down ? mx : 0,
        y: down ? my : 0,
        distance: down ? distance : 0,
      });

      const newIndex = context.calculateNewIndex(values[0], values[1]);
      if (newIndex !== -1 && newIndex !== index) {
        context.doSwap(index, newIndex);
        cancel();
      }
    }
  );

  useLayoutEffect(() => {
    context.updateBoundRect(id, ref.current.getBoundingClientRect());
  }, [id, context]);

  return (
    <Paper
      ref={ref}
      component={animated.div}
      {...dragHandler()}
      style={{
        ...Styles.cardBase,
        transform: interpolate([x, y], (x, y) => `translate(${x}px, ${y}px)`),
        zIndex: isDown ? 2 : 0,
        background: interpolate([distance], {
          range: [0, 200],
          output: ["white", green[200]],
          extrapolateRight: "clamp",
        }).interpolate((c) => c),
      }}
      elevation={3}
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
  );
};

const Test1 = () => {
  const [items, setItems] = useState([
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
  ]);

  useKeyPress("1", () => {
    swap(items, 0, 1);
    setItems(items);
  });

  const context = useMemo(() => {
    return {
      updateBoundRect: (id, rec) => {
        const itm = items.find((itm) => itm.id === id);
        itm.boundRect = rec;
      },
      calculateNewIndex: (x, y) => {
        const index = items.findIndex(({ id, boundRect }) => {
          return boundRect && contain(x, y, boundRect);
        });
        return index;
      },
      doSwap: (index1, index2) => {
        console.log("swap", index1, index2);
        swap(items, index1, index2);
        console.log(items.map((itm) => itm.id));
        setItems([...items]);
      },
    };
  }, [items]);

  window.items = items;

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      style={Styles.container}
    >
      {items.map(({ id }, index) => (
        <Card key={id} index={index} id={id} context={context} />
      ))}
    </Grid>
  );
};

Styles.container = { background: blue[50], padding: 20 };

/** @type {React.CSSProperties} */
Styles.cardBase = {
  width: 100,
  height: 100,
  margin: "32px 32px 0px 32px",
  willChange: "transform, background",
};

Styles.cardContent = {
  userSelect: "none",
  height: "100%",
};

export default Test1;
