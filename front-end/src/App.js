import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import ScoreReaction from './components/ScoreReaction';
import Main from './components/Main';

function App() {
  
  const [score, setScore] = useState(false); //if true score reaction is displayed,

  let display;
  if (score)
  {
    display = <ScoreReaction scored={setScore}/>;
  }
  else
  {
    display = <Main scored={setScore}/>;
  }

    return (
      <div className="App">
      {display}
      </div>
    );
}

export default App;
