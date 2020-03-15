import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useLocation
} from "react-router-dom";
import { useSpring, animated, useTransition, useSprings } from "react-spring";

const images = ["./1.jpg", "2.jpg"];
const columns = 4;
const cellWidth = window.innerWidth / 4;
const random = length => Math.floor(Math.random() * length);
const items = new Array(10).fill(null);
const startingSize = {
  width: cellWidth,
  height: cellWidth
};
const pageImageSize = {
  width: window.innerWidth,
  height: window.innerHeight
};

function Page() {
  return (
    <div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          backgroundImage: `url(${images[0]})`,
          backgroundSize: "cover",
          ...pageImageSize
        }}
      ></div>
    </div>
  );
}

function getCellPos(i) {
  const x = cellWidth * (i % columns);
  const y = cellWidth * Math.floor(i / columns);

  return [x, y];
}

function Grid() {
  const history = useHistory();
  const [active, setActive] = useState(null);

  const [springs, set, stop] = useSprings(items.length, i => {
    const x = cellWidth * (i % columns);
    const y = cellWidth * Math.floor(i / columns);
    return {
      from: {
        xy: [x, y],
        ...startingSize
      }
    };
  });

  useEffect(() => {
    const flow = i => {
      const xy = getCellPos(i);

      const from = {
        xy,
        ...startingSize
      };
      if (i === active) {
        return {
          from,
          xy: [0, -500],
          width: window.innerWidth,
          height: window.innerHeight,
          opacity: 1
        };
      }
      return {
        from,
        to: { ...from }
      };
    };

    set(flow);

    if (active !== null) {
      setTimeout(() => {
        history.push("/page/" + active);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <animated.div
      style={{
        position: "relative",
        top: 500
      }}
    >
      {springs.map((props, i) => {
        return (
          <animated.div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              backgroundImage: `url(${images[0]})`,
              backgroundSize: "cover",
              transform: props.xy.interpolate(
                (x, y) => `translate3d(${x}px, ${y}px, 0)`
              ),
              ...props,
              zIndex: active === i ? 999 : 0
            }}
            onClick={() => setActive(i)}
            key={i}
          />
        );
      })}
    </animated.div>
  );
}

function App() {
  const location = useLocation();
  const transitions = useTransition(location, location => location.pathname, {
    from: { position: "absolute", opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });
  return (
    <div className="App">
      {transitions.map(({ item, props, key }) => (
        <animated.div key={key} style={props}>
          <Switch>
            <Route path="/page/:id">something</Route>
            <Route path="/">
              <Grid />
            </Route>
          </Switch>
        </animated.div>
      ))}
    </div>
  );
}

const withRouter = ({ children }) => <Router>{children}</Router>;

export default withRouter(App);
