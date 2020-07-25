import React from 'react';
import './App.css';

import Approval from './Approval';
import News from './News.js'

function App() {
    return (
        <div id='main' className="bg-gray-100 m-4">
            <Approval
                className=''
                width='90%'
                height='450' />
            <News />
        </div>
    );
}

export default App;
