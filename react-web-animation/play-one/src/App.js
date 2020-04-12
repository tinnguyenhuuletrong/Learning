import React, { useState, useRef } from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import { blue, green } from "@material-ui/core/colors";

import { useSpring, animated, interpolate } from "react-spring";
import { useDrag } from "react-use-gesture";

import "./app.css";

const Styles = {};

const Card = ({ id }) => {
  const [{ x, y, distance }, set] = useSpring(() => ({
    x: 0,
    y: 0,
    distance: 0,
  }));
  const [isDown, setIsDown] = useState(false);
  const dragHandler = useDrag(({ down, movement: [mx, my], distance }) => {
    setIsDown(down);
    set({
      x: down ? mx : 0,
      y: down ? my : 0,
      distance: down ? distance : 0,
    });
  });

  return (
    <Paper
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

const App = () => {
  const items = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      style={Styles.container}
    >
      {items.map(({ id }) => (
        <Card key={id} id={id} />
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
  height: "100%",
};

export default App;
