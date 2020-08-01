import React, { Component } from 'react';
import { Tweet } from './Twitter.js';
import { Article } from './News.js';
import Style from './Style.js';

export default class Feed extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
        };
    }

    render() {
        console.log(this.props)
        return (
            <div
                className='w-100 p-5 m-5 overflow-y-scroll'
                style={{height:'100vh'}}
            >
                
                {this.props.feedOBJ.map((el,k) => el.abstract ? <Article el={el} k={k} /> : <Tweet el={el} k={k} />)}
            </div>
        )
    }
}