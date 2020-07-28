import React, { Component } from 'react';

const yyyymmdd = (date) => {
    let year = date.slice(0, 4);
    let month = date.slice(4, 6);
    let day = date.slice(6, 8);

    return month + '/' + day + '/' + year
};
  
class Article extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    render() {
        let { el, k } = this.props; 
        return (
            <div className='article p-3 flex flex-row' key={k}>
                {el.photo ? 
                <div className='w-64'><img src={`https://www.nytimes.com/${el.multimedia[4].url}`} className='w-4/5 pt-3 content-center m-auto max-w-xs'></img></div> 
                : 
                '' }
                
                <div className={el.photo ? 'w-2/3 flex flex-col mt-3' : 'w-100 flex flex-col mt-3'}>
                    <h1 className='font-bold text-2xl'>{el.headline.print_headline}</h1>
                    <h1 className='font-bold text-xl'>{el.pub_date.split('T')[0]}</h1>
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
            
        };
    }
        
    render() {
        const prevNYT = this.state.nytArticles;

        const { startDate, endDate } = this.props;
        

        return (
            <div
                id="events"
                className="w-100 border-2 bg-white shadow-lg rounded-lg bg-white-100 overflow-hidden p-5 my-6">
                
                <h1 className="font-bold text-2xl pl-5 pt-5">Events</h1>
                <h1 className="font-bold text-2xl pl-5 pt-2 pb-8">{yyyymmdd(startDate)} - {yyyymmdd(endDate)}</h1>

                <div id="events-list" className="overflow-y-auto" style={style.eventsList}>

                {this.props.nytObj.map((el, k) =>  <Article el={el} k={k} /> )}

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