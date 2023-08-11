import Test from "./test"

import { Fakelor, FakelorProvider } from "./Fakelor"

const fakelor = new Fakelor();

function App() {
  return (
    <FakelorProvider fakelor={ fakelor }>
      <Test />
    </FakelorProvider>
  );
}

export default App
