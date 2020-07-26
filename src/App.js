import React from 'react';
import './App.css';
import Style from './Style.js';


import Approval from './Approval';
import News from './News.js'

function App() {
    return (
        <div id='main' className="bg-gray-100 p-4">
            <Approval
                className=''
                width='90%'
                height='100' />
        </div>
    );
}

export default App;
