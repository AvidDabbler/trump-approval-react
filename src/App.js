import React from 'react';
import './App.css';

import Approval from './Approval';
import FiveThirtyEightEvents from './News.js'

function App() {
    return (
        <div id='main' className="bg-gray-100 flex flex-row m-4">
            <Approval
                className=''
                width='50%'
                height='450' />
            <FiveThirtyEightEvents />
        </div>
    );
}

export default App;
