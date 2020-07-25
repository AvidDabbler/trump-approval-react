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
            <div id='news' style={Style.news} className='w-100 h-10 grid content-center border-2 bg-white shadow-lg rounded-lg bg-white-100 overflow-hidden p-5 mt-5'>
                <h1>Events</h1>
            </div>
        </div>
    );
}

export default App;
