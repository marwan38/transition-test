import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
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
const columns = window.innerWidth < 768 ? 2 : 4;
const cellWidth = window.innerWidth / columns;
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
let activeOne = null;
let prevActiveOne = null;
function getCellPos(i) {
  const x = cellWidth * (i % columns);
  const y = cellWidth * Math.floor(i / columns);

  return [x, y];
}
const flow = i => {
  const xy = getCellPos(i);

  const nonActiveState = {
    xy,
    ...startingSize
  };

  const activeState = {
    xy: [0, -500],
    ...pageImageSize
  };

  if (i === prevActiveOne && activeOne === null) {
    return {
      from: { ...activeState },
      to: { ...nonActiveState }
    };
  } else if (i !== prevActiveOne && activeOne === null) {
    return {
      from: { ...nonActiveState, opacity: 0 },
      to: { ...nonActiveState, opacity: 1 }
    };
  }

  if (activeOne === null) {
    return {
      from: { ...nonActiveState, opacity: 1 },
      to: { ...nonActiveState, opacity: 1 }
    };
  }

  if (i === activeOne) {
    return {
      from: { ...nonActiveState, opacity: 1 },
      to: { ...activeState, opacity: 1 }
    };
  } else if (i !== activeOne && activeOne !== null) {
    return {
      from: { ...nonActiveState, opacity: 1 },
      to: { ...nonActiveState, opacity: 0 }
    };
  }

  // return {
  //   from: { ...nonActiveState },
  //   to: { ...nonActiveState }
  // };
};

function Page() {
  const history = useHistory();
  const fade = useSpring({ from: { opacity: 0 }, opacity: 1 });
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div
        style={{
          backgroundImage: `url(../${images[0]})`,
          backgroundSize: "cover",
          backgroundPosition: '50%',
          ...pageImageSize
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 20
        }}
        onClick={() => {
          prevActiveOne = activeOne;
          activeOne = null;
          history.goBack();
        }}
      >
        Back
      </div>
      <h1>Some page</h1>
      <p>Bla bla bla bla</p>
      <h3>more stuff</h3>
      <p>Bla bla bla bla</p>
      <p>Bla bla bla bla</p>
      <p>Bla bla bla bla</p>
      <p>Bla bla bla bla</p>
      <p>Bla bla bla bla</p>
      <p>Bla bla bla bla</p>
      <p>Bla bla bla bla</p>
      <p>Bla bla bla bla</p>
      <p>Bla bla bla bla</p>
    </div>
  );
}

function Grid() {
  const history = useHistory();
  const [active, setActive] = useState(activeOne);

  const [springs, set, stop] = useSprings(items.length, flow);

  useEffect(() => {
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
        console.log(props);
        return (
          <animated.div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              backgroundImage: `url(${images[0]})`,
              backgroundSize: "cover",
              backgroundPosition: '50%',
              zIndex: active === i ? 999 : 0,
              transform: props.xy.interpolate(
                (x, y) => `translate3d(${x}px, ${y}px, 0)`
              ),
              ...props
            }}
            onClick={() => {
              activeOne = i;
              setActive(i);
            }}
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
    from: { position: "absolute", width: "100%", height: "100%" },
    leave: { opacity: 0 }
  });
  return (
    <div className="App" style={{ minHeight: "100vh", minWidth: "100vw" }}>
      {transitions.map(({ item, props, key }) => (
        <animated.div key={key} style={props}>
          <Switch>
            <Route path="/page/:id" component={Page} />
            <Route path="/">
              <Grid />
            </Route>
          </Switch>
        </animated.div>
      ))}
    </div>
  );
}

function WithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
export default WithRouter;
