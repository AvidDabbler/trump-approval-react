import React from 'react';
import './App.css';

import Approval from './Approval';

function App() {
  return (
    <div id='main' className="App bg-gray-100" style={{flex: 1}}>
      <Approval
        className=''
        width='50%'
        height='450' />
    </div>
  );
}

export default App;
