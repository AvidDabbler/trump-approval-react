import React, { Component } from 'react';
import * as d3 from 'd3';
import Style from './Style.js';
import * as axios from 'axios';
import { p, cors_noDate } from './private.js';
import { News } from './News.js';
import { Twitter } from './Twitter.js';
import Feed from './Feed.js';


// Twitter data
import year2017 from './data/2017.json';
import year2018 from './data/2018.json';
import year2019 from './data/2019.json';
import year2020 from './data/2020.json';

let twitterRaw = {
    year2017: year2017,
    year2018: year2018,
    year2019: year2019,
    year2020: year2020,
};


const s = d3.select("body")
    
export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth - 40,
            height: 0,
            w: window.innerWidth,
            h: 0,

        };
        this.nytData = this.nytData.bind(this);
        this.twitterData = this.twitterData.bind(this);
        this.updateMax = this.updateMax.bind(this);
        this.updateMin = this.updateMin.bind(this);
        this.filterData = this.filterData.bind(this);
    }
    
    async componentDidMount() {
        this.setState({
            min: this.state.minDate,
            max: this.state.maxDate,
            twitterLoading: true,
            nytLoading: true,
        })
        let data = await this.processData();
        this.chartRender(await data, 'approve', "#trumpApproval");
        this.feedData(new Date());
    };






    async nytData(nytD) {
        let date = new Date(nytD);
        
        let e = parseInt(`${date.getFullYear()}${date.getMonth() + 1 < 10 ? `0` + (date.getMonth() + 1) : date.getMonth() + 1}${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`);
        let sDate = date;
        sDate.setDate(sDate.getDate() - 7)
        let s = parseInt(`${sDate.getFullYear()}${sDate.getMonth()+1 < 10 ? `0`+ (sDate.getMonth()+1) : sDate.getMonth()+1}${(sDate.getDate()) < 10 ? '0' + (sDate.getDate()) : (sDate.getDate())}`)

        let url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=${s}&end_date=${e}&q=trump&sort=relevance&api-key=${p().nyt}`

        const media = arr => {
            arr.map(el => el.photo = el.multimedia.length > 3)
            return arr
        }

        let arr = await axios.get(cors_noDate(url), {
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
        }).then(arr => {
            return arr
        }).then(async arr => {
            if(await arr.data.response == 400){
                console.log('400')
                return;
            }
            let list = arr.data.response.docs
            let final = () => {
                list.forEach(art => {
                    art['photo'] = art.multimedia.length > 3;
                    art['date'] = new Date(new Date(art.pub_date));
                })
                return list
            }
            return await final()
        })



        await this.setState({
            nytLoading: false,
            nytObj: await arr,
            startDate: s,
            endDate: e
        });

        return await arr;

    };

    nytFeedFormat(art) {
        art['photo'] = art.multimedia.length > 3;
        art['date'] = new Date(new Date(art.pub_date));
    };



    // filter's and sorts tweets by dates
    async filterTwitter(tweets, start, end) {
        const arr = () => {
            let list = []
            for(let i = 0; i < tweets.length; i++){
            tweets[i]['date'] = new Date(tweets[i]['created_at'])
            if (tweets[i].date > start & tweets[i].date < end){ 
                list.push(tweets[i])
             }
            }
            return list
        }
        return await arr();
    };

    // return twitter data and assigns state's twitterOBJ
    async twitterData(clickDate = new Date()) {
        const end = new Date(clickDate);
        const start = new Date(clickDate.setTime(clickDate.getTime() - ((24 * 60 * 60 * 1000) * 5)));

        // get year or years of tweets
        const yearData = async (end, start) => {
            if (end.getFullYear() == start.getFullYear()) {
                return await this.filterTwitter(twitterRaw[`year${end.getFullYear()}`], start, end)
            } else {
                let endYear = await this.filterTwitter(twitterRaw[`year${end.getFullYear()}`], start, end)
                let startYear = await this.filterTwitter(twitterRaw[`year${start.getFullYear()}`], start, end)
                return await startYear.concat(await endYear);
            }
        };
        
        const twitterOBJ = await yearData(end, start);

        await this.setState({
            twitterOBJ: await twitterOBJ,
            twitterLoading: false
        });
        return await twitterOBJ
    };


    async feedData(d = new Date()) {
        // pulls in the twitter and nyt data and formats them
        let twitter = await this.twitterData(new Date(d));
        let nyt = await this.nytData(new Date(d));
        let feed = await twitter.concat(nyt)
        let ffeed = await feed.sort((a, b) => new Date(b.date) - new Date(a.date))

        this.setState({ feedOBJ: await ffeed })
        
    };




    // start of fivethrity eight data manipulation
    async filterData(event) {
        event.preventDefault();
        let { trumpApproval, min, max } = this.state;
        let data = trumpApproval.filter(el => el.modeldate > min && el.modeldate < max )
        this.chartRender(await data, 'approve', "#trumpApproval");
    }

    setData(data) {
        this.setDates(data)
        this.setState({ trumpApproval: data });
        return data;
    };
  
    yyyymmdd(date) {
      var mm = (date.getMonth()+1) < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`; // getMonth() is zero-based
      var dd = date.getDate() < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    
      return [date.getFullYear(),
              (mm>9 ? '' : '0') + mm,
              (dd>9 ? '' : '0') + dd
            ].join('-');
    };
     
    setDates(data) {
        data.map(el => {
            el['statDate'] = new Date(el.old_date);
        });
        this.setState({
            minDate: this.yyyymmdd(data[1].statDate),
            maxDate: this.yyyymmdd(data[data.length-1].statDate),
            minTime: data[1].statDate,
            maxTime: data[data.length-1].statDate
        })
        this.filterDates(data)
    };

    filterDates(data) {
        data.filter(el => el.statDate>=this.state.minDate && el.statDate <= this.state.maxDate )
    };

    percentChange(ar) {
        for (let i = 0; i < (ar.length - 7); i++){
            let weekChange = i + 7
            ar[weekChange].weeklyChange = `${(((ar[weekChange].approve_estimate - ar[i].approve_estimate) / ar[i].approve_estimate) * 100)}`;
        }
        for (let i = 0; i < (ar.length - 30); i++){
            let monthChange = i + 30
            ar[monthChange].monthlyChange = `${(((ar[monthChange].approve_estimate - ar[i].approve_estimate) / ar[i].approve_estimate) * 100)}`;
        }
        return ar
    }

    processData = async () => {
        let csvParse = await d3.csv(await `https://projects.fivethirtyeight.com/trump-approval-data/approval_topline.csv`, data => {
            return {
                subgroup: data.subgroup,
                old_date: data.modeldate,
                modeldate: new Date(data.modeldate),
                approve_estimate: data.approve_estimate,
                disapprove_estimate: data.disapprove_estimate
            };
        });
        let csvSort = await csvParse.sort((a, b) => a.modeldate - b.modeldate);
        this.setData(await csvSort)
        let final = await this.percentChange(await csvSort)
        return await final;
    };

    chartRender = async (data, id, div) => {
        const filtered = await data.filter(data => data.subgroup == "All polls");
        const flength = await filtered.length;
        const width = this.state.width  * .7
        const height = 250;

        const clickCircle = (d) => {
            this.nytData(d.statDate).then(async response => {
                if(response.status == 400) {
                    console.log('400')
                    return
                }
                    return await response
            })
            this.feedData(d.statDate)
        };

        this.setState({ flength: flength });

        let svgChart = d3.select(div)
            .append('svg')
            .attr("width", width + 20)
            .attr("height", height)
            .attr('id', 'svgChart')
            .attr('class', 'flex mx-auto')
      
        // approval render
        svgChart.selectAll('circle')
            .data(filtered)
            .attr("class", d => id + '_' + d.subgroup)
            .attr("id", d => id + '_' + d.modeldate)
            .enter()
            .append('circle')
            .attr("cx", (d, i) => ( ( ( (i) * (width / flength) ) ) + 10) )
            .attr("cy", (d) =>  ((100 - d.approve_estimate) * (height / 100)) - 40 )
            .attr("r", d => 3)

            .style("fill", d => 'red')
            .on("mouseover", function (d) {
                d3.select(this).attr("r", d => 10);
                document.getElementById('approve').innerHTML = `${d.approve_estimate.slice(0, 4)}%`;
                document.getElementById('disapprove').innerHTML = `${d.disapprove_estimate.slice(0, 4)}%`;
                document.getElementById('week-change').innerHTML = `${d.weeklyChange.slice(0, 4)}%`;
                document.getElementById('month-change').innerHTML = `${d.monthlyChange.slice(0, 4)}%`;
                document.getElementById('approve-date').innerHTML = `${d.old_date}`;
            })
            .on("mouseout", function () {
                d3.select(this).attr("r", d => 2)
                return
            })
            .on('click', d => clickCircle(d) )
            .enter()
            .data(filtered)
            .attr("class", d => id + '_' + d.subgroup)
            .attr("id", d => id + '_' + d.modeldate)
            .enter()
            .append('circle')
            .attr("cx", (d, i) => ( ( ( (i) * (width / flength) ) ) + 10) )
            .attr("cy", (d) =>  ((100 - d.disapprove_estimate) * (height / 100)) - 40 )
            .attr("r", d => 3)
            .style("fill", d => 'blue')
            .on("mouseover", function (d) {
                d3.select(this).attr("r", d => 10);
                document.getElementById('approve').innerHTML = `${d.approve_estimate.slice(0, 4)}%`;
                document.getElementById('disapprove').innerHTML = `${d.disapprove_estimate.slice(0, 4)}%`;
                document.getElementById('week-change').innerHTML = `${d.weeklyChange.slice(0, 4)}%`;
                document.getElementById('month-change').innerHTML = `${d.monthlyChange.slice(0, 4)}%`;
                document.getElementById('approve-date').innerHTML = `${d.old_date}`;

            })
            .on("mouseout", function () {
                d3.select(this).attr("r", d => 2)
                return
            })
            .on('click', d => clickCircle(d) )
    };

    updateMin(ev) {
        this.setState({
            minDate: ev.target.value,
            minTime: new Date(ev.target.value)
        })
    }
    
    updateMax(ev) {
        this.setState({
            maxDate: ev.target.value,
            maxTime: new Date(ev.target.value)
        })
    }
    
    render() {
        const { startDate, endDate, feedOBJ } = this.state; 
        return (
            <React.Fragment>
                <div
                    id='approvalContainer'
                    className="w-100 flex flex-row mb-5"
                    style={this.approvalContainer}
                >  
                    <div id='trumpApproval'
                        className="p-5 w-4/5 border-2 bg-white shadow-lg rounded-lg bg-white-100"
                        style={Style.trumpApproval}>  
                        <h1 className="font-bold text-2xl pt-1 pb-8">Trump Approval Ratings</h1>
                    </div>

                    <div className='w-1/5 ml-5 p-5 border-2 text-center bg-white shadow-lg rounded-lg'>   
                        <h1 className="font-extrabold text-2xl" id="approve-date">--</h1>
                        <h3 className="font-bold text-xl">Approval</h3><h3 id='approve'>--%</h3>
                        <h3 className="font-bold text-xl">Disapproval</h3><h3 id='disapprove'>--%</h3>
                        <h3 className="font-bold text-xl">Weekly Change</h3><h3 id='week-change'>--%</h3>
                        <h3 className="font-bold text-xl">Monthly Change</h3><h3 id='month-change'>--%</h3>
                    </div>
                </div>

                    
                    
                <div
                    id='info-container'
                    className='w-100 border-2 bg-white shadow-lg rounded-lg bg-white-100 overflow-hidden'
                    style={{height:'100vh'}}
                >
                    <h1>News & Tweets</h1>
                    <h1>{startDate} - {endDate}</h1>
                        {feedOBJ ? <Feed feedOBJ={feedOBJ} startDate={startDate} endDate={endDate}/> : ''}
                </div>
            
            </React.Fragment>
        )
    };

    
};
            