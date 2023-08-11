import React from "react"

import Counties from "./counties"

const FakelorContext = React.createContext();

const useFakelor = () => React.useContext(FakelorContext);

class Fakelor {
  listeners = [];
  get() {
    return new Promise(resolve => {
      setTimeout(resolve, 1500, Counties);
    }).then(counties => {
        this.listeners.forEach(l => {
          if (typeof l === "function") {
            l({ counties });
          }
        });
      })
  }
  onChange(listener) {
    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener);
    }
  }
  remove(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }
}

const FakelorProvider = ({ fakelor, children }) => {

  const [fakelorCache, setFakelorCache] = React.useState({});

  React.useEffect(() => {
    fakelor.onChange(setFakelorCache);
    return () => {
      fakelor.remove(setFakelorCache);
    }
  }, [fakelor]);

  const fakelorValue = React.useMemo(() => {
    return { fakelor, fakelorCache }
  }, [fakelor, fakelorCache]);

  return (
    <FakelorContext.Provider value={ fakelorValue }>
     { children }
    </FakelorContext.Provider>
  )
}

export { Fakelor, FakelorProvider, useFakelor }
