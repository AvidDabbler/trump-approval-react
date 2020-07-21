import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { nytKey } from './private.js'

export default class FiveThirtyEightEvents extends Component {
    constructor(props) {
		super(props);
        this.state = {
            yearMonth: [],
            nytArticles: []
        };
    }

    componentDidMount() {
        this.getAllArticles();
    }

    getEvents(year, month, nytKey) {
        fetch(`https://api.nytimes.com/svc/archive/v1/${year}/${month}.json?api-key=${nytKey}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error(response);
                }
            }) 
    }

    getAllArticles() {
        let startDate = new Date('3/01/2016');
        let endDate = new Date();
        const getEvents = (year, month, nytKey) => {
            fetch(`https://api.nytimes.com/svc/archive/v1/${year}/${month}.json?api-key=${nytKey}`)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        console.error(response);
                    }
                }) 
        }

        let { yearMonth } = this.state;

        for (let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++) {
            if (year == endDate.getFullYear()) {
                for (let month = startDate.getMonth() + 1; month <= endDate.getMonth() + 1; month++) {
                    yearMonth.push([year, month]);
                }
            } else {
                for (let month = startDate.getMonth() + 1; month <= 12; month++) {
                    yearMonth.push([year, month]);
                }   
            }
        }
        let nytArticles = [];
        yearMonth.forEach(date => {
            fetch(`https://api.nytimes.com/svc/archive/v1/${date[0]}/${date[1]}.json?api-key=${nytKey()}`)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        console.error(response);
                    }
                }) 
        })
        this.setState({ nytArticles: nytArticles });
    }

    render() {
        return (
            <div id="events"
                className="w-1/3 border-2 float-right ml-5 bg-white shadow-lg rounded-lg bg-white-100 overflow-hidden p-5"
            >
                <h1
                    className="font-bold text-2xl pt-1 pb-8"
                >
                    Events
                </h1>

                <div
                    id="events-list"
                    className=""
                >Loading Events...</div>
                
            </div>
        )
    }
}