
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { cors, p, cors_noDate } from './private.js';

/*
todo: add photos to articles
todo: scroll articles
todo: filter articles
*/

const yyyymmdd = (date) => {
    date = new Date(date);
    var mm = date.getMonth() + 1; // getMonth() is zero-based
    var dd = date.getDate();
  
    return [date.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
          ].join('-');
};
  
class Article extends Component {
    constructor(props) {
        super(props)
        this.state = {
            el: this.props.el,
            k: this.props.k
        }
    }

    render() {
        let { el, k } = this.state; 
        return (
            <div className='article p-3 flex flex-row' key={k}>
                {el.photo ? <div className='w-1/3'><img src={`https://www.nytimes.com/${el.multimedia[4].url}`} className='w-4/5 pt-3 content-center m-auto'></img></div> : '' }
                
                <div className={el.photo ? 'w-2/3 flex flex-col' : 'w-100 flex flex-col'}>
                    <h1 className='font-bold text-lg'>{el.headline.print_headline}</h1>
                    <h1 className='font-bold'>{yyyymmdd(el.pub_date)}</h1>
                    <h1 className='font-bold'>{el.byline.original}</h1>
                    <h1>{el.snippet}</h1>
                </div>
            </div>
        )
    }
}

export default class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nytArticles: this.props.nytArticles,
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            nytObj: this.props.nytObj
             
        };
    }

    componentDidMount() {
        this.setState({nytArticles: this.articles()})

    }

    articles = () => {
        return (
            this.state.nytObj.map((el, k) => (
                <Article el={el} k={k} />
            ))
        )
    };

    
        
    render() {
        const { nytArticles, startDate, endDate } = this.state;
        return (
            <div
                id="events"
                className="w-100 border-2 bg-white shadow-lg rounded-lg bg-white-100 overflow-hidden p-5 my-6">
                
                <h1 className="font-bold text-2xl pt-1 pb-8">Events</h1>
                <h1 className="font-bold text-2xl pt-1 pb-8">{yyyymmdd(startDate)} - {yyyymmdd(endDate)}</h1>

                <div id="events-list" className="overflow-y-auto" style={style.eventsList}>
                    {nytArticles ? nytArticles : console.log('articles loading')}
                </div>
            </div>
        )
    }
}


const style = {
    eventsList: {
        height: '100vh'
    }
}