import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import { forceCenter, svg } from 'd3';
import Style from './Style.js';


/*

todo: add in weekly and monthly percent changes on mouseover
todo: pass click props to News to filter articles 
 
*/


const s = d3.select("body")
    
export default class Approval extends Component{
    constructor(props) {
		super(props);
        this.state = {
            width: window.innerWidth - 60,
            height: 0,
            w: window.innerWidth,
            h: 0,
            s: d3.select("body").append("svg").attr({
                width: this.w,
                height: this.h
            })
        };

        this.updateMax= this.updateMax.bind(this)
        this.updateMin= this.updateMin.bind(this)
        this.filterData= this.filterData.bind(this)
    }
    
    async componentDidMount() {
        let data = await this.processData();
        this.chartRender(await data, 'approve', "#trumpApproval");
        this.setState({
            min: this.state.minDate,
            max: this.state.maxDate
        })
    };

    fetchedData = async (url) => {
        let response = await fetch(url)
        let data = await response.json();
        if (data.ok) {
            return data;
        } else {
            console.warn('issue with fetchdedData() ', data);
            return;
        }
    };

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
      var mm = date.getMonth() + 1; // getMonth() is zero-based
      var dd = date.getDate();
    
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

    processData = async () => {
        let csvParse = await d3.csv(await 'https://projects.fivethirtyeight.com/trump-approval-data/approval_topline.csv', data => {
            return {
                subgroup: data.subgroup,
                old_date: data.modeldate,
                modeldate: new Date(data.modeldate),
                approve_estimate: data.approve_estimate,
                disapprove_estimate: data.disapprove_estimate
            };
        });
        let csvSort = await csvParse.sort((a, b) => a.modeldate - b.modeldate);
        this.setData(await csvSort, ()=>console.log(this.state))
        
        return await csvSort;
    };

    chartRender = async (data, id, div) => {
        const filtered = await data.filter(data => data.subgroup == "All polls");
        const flength = await filtered.length;
        const width = this.state.width  
        const height = 250;

        this.setState({ flength: flength });

        let svgChart = d3.select(div)
            .append('svg')
            .attr("width", width)
            .attr("height", height)
            .attr('id', 'svgChart')
      
        
        // approval render
        svgChart.selectAll('circle')
            .data(filtered)
            .attr("class", d => id + '_' + d.subgroup)
            .attr("id", d => id + '_' + d.modeldate)
            .enter()
            .append('circle')
            .attr("cx", (d, i) => {
                return ((((i) * (width / flength)) ) + 10 ) * .71;
            })
            .attr("cy", (d) => {
                return ((100 - d.approve_estimate) * (height / 100)) - 40;

            })
            .attr("r", d => 3) 

            .style("fill", d => 'red')
            .on("mouseover", function (d) {
                d3.select(this).attr("r", d => 10);
                document.getElementById('approve').innerHTML = `${d.approve_estimate.slice(0, 4)}%`;
                document.getElementById('disapprove').innerHTML = `${d.disapprove_estimate.slice(0, 4)}%`;
                document.getElementById('approve-date').innerHTML = `${d.old_date}`;
            })
            .on("mouseout", function () {
                d3.select(this).attr("r", d => 2)
                return 
            })
            .enter()
            .data(filtered)
            .attr("class", d => id + '_' + d.subgroup)
            .attr("id", d => id + '_' + d.modeldate)
            .enter()
            .append('circle')
            .attr("cx", (d, i) => {
                return ((((i) * (width / flength)) ) + 10) * .71;
            })
            .attr("cy", (d) => {
                return ((100 - d.disapprove_estimate) * (height / 100)) - 40;
            })
            .attr("r", d => 3)
            .style("fill", d => 'blue')
            .on("mouseover", function (d) {
                d3.select(this).attr("r", d => 10);
                document.getElementById('approve').innerHTML = `${d.approve_estimate.slice(0, 4)}%`;
                document.getElementById('disapprove').innerHTML = `${d.disapprove_estimate.slice(0, 4)}%`;
                document.getElementById('approve-date').innerHTML = `${d.old_date}`;

            })
            .on("mouseout", function () {
                d3.select(this).attr("r", d => 2)
                return
            });
    };


    handleMouseOver() {  
        d3.select(this)
            .attr("r", d => 10)
     };

    handleMouseOut(d, i) {
        // Use D3 to select element, change color back to normal
        d3.select(this)
            .attr("r", d => 2);
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
        const { min, max } = this.state; 
       
        return (
            <div
                id='approvalContainer'
                className="w-100 flex flex-row"
                style={this.approvalContainer}
            >  
                
                <div id='trumpApproval'
                    className="p-5 w-4/5 border-2 bg-white shadow-lg rounded-lg bg-white-100"
                    style={Style.trumpApproval}>  
                    <h1 className="font-bold text-2xl pt-1 pb-8">Trump Approval Ratings</h1> 
                </div>

                <div
                    className='ml-5 p-5 border-2 text-center bg-white shadow-lg rounded-lg'
                >   
                    <h1 class="font-extrabold text-2xl" id="approve-date">--</h1>
                    <h3 class="font-bold text-xl">Approval</h3><h3 id='approve'>--%</h3>
                    <h3 class="font-bold text-xl">Disapproval</h3><h3 id='disapprove'>--%</h3>
                    <h3 class="font-bold text-xl">Weekly Change</h3><h3 id='week-change'>--%</h3>
                    <h3 class="font-bold text-xl">Monthly Change</h3><h3 id='month-change'>--%</h3>
                </div>

            </div>
        )
    };

    
};
            