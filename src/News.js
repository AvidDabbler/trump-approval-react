import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { cors, p, cors_noDate } from './private.js';
import * as axios from 'axios';
import Style from './Style.js';


/*

//todo: add photos to articles
//todo: scroll articles
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

const dates = (clickDate = new Date()) => {
    let startDate = clickDate ? clickDate : new Date();
    let end = startDate.getFullYear() + (startDate.getMonth() + 1 < 10 ? `0${startDate.getMonth() + 1}` : startDate.getMonth() + 1) + startDate.getDate();
    let start = end - 7
    return {
        start: start,
        end: end
    }

};

const nytJSX = async (data) => {
    return (
        data.map((el, k) => (
            <div className='article p-3 flex flex-row' key={k}>
                {el.photo ? <div className='w-1/3'><img src={`https://www.nytimes.com/${el.multimedia[4].url}`} className='w-4/5 pt-3 content-center m-auto'></img></div> : '' }
                
                <div className={el.photo ? 'w-2/3 flex flex-col' : 'w-100 flex flex-col'}>
                    <h1 className='font-bold text-lg'>{el.headline.print_headline}</h1>
                    <h1 className='font-bold'>{yyyymmdd(el.pub_date)}</h1>
                    <h1 className='font-bold'>{el.byline.original}</h1>
                    <h1>{el.snippet}</h1>
                </div>
            </div>
        ))
    )
};

const nytData = async (cd) => {
    let { start, end } = cd;   

    let url = `https://api.nytimes.com/svc/archive/v1/2019/1.json?q=trump&news_desk=Politics&source="The New York Times"&begin_date=${start}&end_date=${end}&api-key=${p().nyt}`;

    let data = await axios.get(cors_noDate(url), {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        },
    }).then(arr => {
        return arr.data.response.docs
    }).then(arr => {
        arr.map(el => el.photo = el.multimedia.length > 3)    
        return arr
    })
    
    // await this.setState({
    //     isLoading: false,
    //     nytObj: data.slice(0, 10),
    //     nytArticles: this.rend(data.slice(0, 10))
    // });

    return data;
};

const news = async (clickDate) => {
    let state = {
            isLoading: true
        };

    let cd = dates(clickDate);

    state['start'] = cd.start;
    state['start'] = cd.end;

    let render = () => {
        const { nytObj, isLoading, nytArticles } = this.state;
        console.log(nytObj);
        return (
            <div
                id="events"
                className="w-2/3 border-2 bg-white shadow-lg rounded-lg bg-white-100 overflow-hidden p-5 my-6">
                
                <h1 className="font-bold text-2xl pt-1 pb-8">Events {}</h1>

                <div id="events-list" className="overflow-y-auto" style={Style.eventsList}>
                    {isLoading ? console.log('its loading') : nytArticles}
                </div>
            </div>
        )
    }

    let articles = await nytData(cd);
    let articlesJSX = await nytJSX(articles)

    return await articlesJSX;
}




export { news };