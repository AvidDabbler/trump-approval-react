import React from 'react';
import './App.css';
import Style from './Style.js';
import Dashboard from './Dashboard.js';
import News from './News.js'

function App() {
    return (
        <div id='main' className="bg-gray-100 p-4">
            <Dashboard
                className='w-4/5'
                width='80hw'
                height='100' />
        </div>
    );
}

export default App;
