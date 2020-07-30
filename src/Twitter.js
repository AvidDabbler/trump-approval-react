import React, { Component } from 'react';
import retweetIMG from './img/retweet.svg';
import trumpIMG from './img/trump.jpg';

class Tweet extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        let { el, k } = this.props; 
        return (
            <div className='article p-3 flex flex-row' key={k}>
                <div className='w-32'><img src={el.is_retweet ? trumpIMG : retweetIMG} className='w-4/5 pt-3 content-center m-auto max-w-xs'></img></div>
                <div className='w-2/3 flex flex-col mt-3'>
                    <h1 className='font-bold text-2xl'>{`${el.created_at}`}</h1>
                    <h1 className='font-bold text-xl'>{el.text}</h1>
                    <h1 className='font-bold'>Retweets: {el.retweet_count} Likes: {el.like_count}</h1>
                    <h1>{el.snippet}</h1>
                </div>
            </div>
        )
    }
};


export default class Twitter extends Component {
    constructor(props) {
        super(props);
    }
 
    render() {
        return (
            <div id='tweets' className="w-1/2 border-2 bg-white shadow-lg rounded-lg bg-white-100 overflow-hidden p-5 mt-5">
                <h1 className="font-bold text-2xl pl-5 pt-5">Tweets</h1>
                <div className="overflow-y-auto" style={style.eventsList}>
                    {this.props.twitterOBJ.map((el) => <Tweet el={el} k={el.id_str} />)}
                </div>
            </div>
        );
    }
}

const style = {
    eventsList: {
        height: '80vh'
    }
}