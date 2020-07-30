import React, { Component } from 'react';
import { render } from '@testing-library/react';

export default class Feed extends Component {
    constructor(props) {
        super(props)

    }

    async formatNTY() {
        let articles = this.props.nytOBJ;
        articles.forEach(art => art['date'] = art.created_at);
        return await articles;
    }
    
    async formatTwitter() {
        let tweets = this.props.tweetsOBJ;
        tweets.forEach(tweet => tweet['date'] = tweet.created_at)
        return await tweets
    }

    render() {
        return (

        )
    }
}