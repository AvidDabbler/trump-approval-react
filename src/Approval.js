import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import { forceCenter, svg } from 'd3';

const s = d3.select("body")
    
export default class Approval extends Component{
    constructor(props) {
		super(props);
        this.state = {
            width: window.innerWidth - 60,
            height: props.height,
            w: window.innerWidth,
            h: window.innerHeight,
            s: d3.select("body").append("svg").attr({
                width: this.w,
                height: this.h
            })
        };
        // this.chartRef = React.createRef();
        // this.dateChange= this.dateChange.bind(this)
        this.updateMax= this.updateMax.bind(this)
        this.updateMin= this.updateMin.bind(this)
        this.filterData= this.filterData.bind(this)
        // this.handleMouseOver= this.handleMouseOver.bind(this)
    }
    
    async componentDidMount() {
        let data = await this.processData();
        this.chartRender(await data, 'approve', "#trumpApproval");
        console.log(this.state)
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

    async filterData() {
        let { trumpApproval, minDate, maxDate } = this.state;
        let data = () => { trumpApproval.filter(el => el.modeldate > minDate && el.modeldate < maxDate )}
        this.chartRender(await data(), 'approve', "#trumpApproval");

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
        this.setData(await csvSort)
        
        return await csvSort;
    };

    chartRender = async (data, id, div) => {
        const filtered = await data.filter(data => data.subgroup == "All polls");
        const flength = await filtered.length;
        this.setState({ flength: flength });


        let svgChart = d3.select(div)
            .append('svg')
            .attr("width", window.innerWidth - 60)
            .attr("height", 450)
            
        
        var tooltip = d3.select("#trumpApproval")
            .data(filtered)
            .append("div")
            .attr('backgroundColor', 'red')
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .append('p')
      
        
        // approval render
        svgChart.selectAll('circle')
            .data(filtered)
            .attr("class", d => id + '_' + d.subgroup)
            .attr("id", d => id + '_' + d.modeldate)
            .enter()
            .append('circle')
            .attr("cx", (d, i) => {
                return ((((i) * (this.state.width / flength)) * 0.95) + 10);
            })
            .attr("cy", (d) => {
                d3.select('circle')
                    .attr("r", d => 10)
                const meas = eval('d.' + 'approve_estimate');
                return ((100 - meas) * (this.state.height / 100));
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
                return tooltip.style("visibility", "hidden");
            })
            .enter()
            .data(filtered)
            .attr("class", d => id + '_' + d.subgroup)
            .attr("id", d => id + '_' + d.modeldate)
            .enter()
            .append('circle')
            .attr("cx", (d, i) => {
                return ((((i) * (this.state.width / flength)) * 0.95) + 10);
            })
            .attr("cy", (d) => {
                return ((100 - d.disapprove_estimate) * (this.state.height / 100));
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
                return tooltip.style("visibility", "hidden");
            });
        
        // create svg elemen    
        var svg = d3.select("#trumpApproval")
            .append("svg")
            .attr("width", 1000)

        var x = d3.scaleTime()
            .domain([this.state.minDate, this.state.maxDate])
            .range(200, 100)
            .nice()

            svg.append("g")
            .call(d3.axisBottom(x));
        
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
        }, console.log(this.state))
    }
    
    updateMax(ev) {
        this.setState({
            maxDate: ev.target.value,
            maxTime: new Date(ev.target.value)
        }, console.log(this.state))
    }
    

    render() {
        const { minDate, maxDate } = this.state; 
        console.log(this.state)
        return (
            <div
                id='approvalContainer'
                style={this.approvalContainer}
                className="p-6"
            >
            <div id='trumpApproval'
                style={styles.trumpApproval}
                className="ml-10 bg-white shadow-lg rounded-lg bg-white-100 overflow-hidden p-5"
                >
                <h1 className="font-bold text-2xl pt-1 pb-8">
                    Trump Approval Ratings</h1>
                <form class='float-right'>
                    <label className='m-2 font-semibold'>Start Date: </label>
                        <input
                            id='start'
                            type="date"
                            className="m-2 bg-white focus:outline-none focus:shadow-outline border border-gray-500 rounded-lg py-2 px-4"
                            defaultValue={minDate}
                            onChange={this.updateMin}
                            min={minDate}
                            max={maxDate}
                        />
                    <label className='m-2 font-semibold'>End Date: </label>
                        <input
                            id='end'
                            type="date"
                            className="m-2 bg-white focus:outline-none focus:shadow-outline border border-gray-500 rounded-lg py-2 px-4"
                            defaultValue={maxDate}
                            onChange={this.updateMax}
                            min={minDate}
                            max={maxDate}
                        />
                    <button
                        class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        id="trumpApprovalSubmit"
                        onClick={this.filterData}
                    >
                        Submit
                    </button>
                </form>

                    
                <div id='statsContainer'>
                    <div class='absolute top-30 ml-10 w-1/4 bg-white shadow-lg rounded-lg overflow-hidden bg-blue-100 p-5'>
                        <h1 class="font-extrabold text-lg" id="approve-date"> -- </h1>
                        <h3 class="font-bold">Approval</h3><h3 id='approve'>--%</h3>
                        <h3 class="font-bold">Disapproval</h3><h3 id='disapprove'>--%</h3>
                    </div>
                </div>
            </div>
            </div>
        )
    };

    
};

const styles = {
    approvalContainer: {
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    trumpApproval: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        justifyContent: 'center',
        // width: '90%',
        height:'85vh'
    }
}
            