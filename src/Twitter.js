import React from 'react';

import trumpIMG from '../public/trump.jpg'
import retweetIMG from '../public/retweet.svg'



// ------- GET TWEETS -------
//http://www.trumptwitterarchive.com/data/realdonaldtrump/2020.json
//'../data/{year}.json
 

class Tweet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    render() {
        let { el, k } = this.props; 
        return (
            <div className='article p-3 flex flex-row' key={k}>
                <div className='w-64'><img src={el.is_retweet ? {trumpIMG} : {retweetIMG}} className='w-4/5 pt-3 content-center m-auto max-w-xs'></img></div>
                <div className='w-2/3 flex flex-col mt-3'>
                    <h1 className='font-bold text-2xl'>{el.created_at}</h1>
                    <h1 className='font-bold text-xl'>{el.text}</h1>
                    <h1 className='font-bold'>Retweets: {el.retweet_count} Likes: {el.like_count}</h1>
                    <h1>{el.snippet}</h1>
                </div>
            </div>
        )
    }
}


export default class Twitter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }
    
    tweets() {
        return (
            this.props.twitterOBJ.map((el, k) => <Tweet el={el} k={k} />)
        )
    }

    render() {
        return (
            <div id='tweets'>
                {this.props.twitterOBJ.map((el, k) => <Tweet el={el} k={k} />)}
            </div>
        );
    }
}