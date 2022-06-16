import logo from './logo.svg';
import './App.css';

import Routage from './Routage'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
		<Routage />
      </header>
    </div>
  );
}

export default App;


// import { Link } from "react-router-dom";
// ...
// <Link to="/signup">
//   <button variant="outlined">
//     Sign up
//   </button>
// </Link>
