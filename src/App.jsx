import Typewriter from "./components/Typewriter";
import ParchmentEditor from "./components/ParchmentEditor";
import "./App.css";

function App() {
  return (
    <div className="app">
      {/* <Typewriter text="Hello, world!" speed={100} /> */}
      <ParchmentEditor />
    </div>
  );
}

export default App;