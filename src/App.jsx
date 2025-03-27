import Typewriter from "./components/Typewriter";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>My Typewriter App</h1>
      <Typewriter text="Hello, world!" speed={100} />
    </div>
  );
}

export default App;