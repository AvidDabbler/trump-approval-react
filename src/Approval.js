import React, { Component } from 'react';
import * as d3 from 'd3';

var w = window.innerWidth,
    h = window.innerHeight


var svg = d3.select("body").append("svg").attr({
    width: w,
    height: h
});

// // We're passing in a function in d3.max to tell it what we're maxing (x value)
// var xScale = d3.scaleLinear()
// .domain([0, d3.max(dataset, function (d) { return d.x + 10; })])
// .range([margin.left, w - margin.right]);  // Set margins for x specific

// // We're passing in a function in d3.max to tell it what we're maxing (y value)
// var yScale = d3.scaleLinear()
// .domain([0, d3.max(dataset, function (d) { return d.y + 10; })])
// .range([margin.top, h - margin.bottom]);  // Set margins for y specific

export default class Approval extends Component{
    constructor(props) {
		super(props);
        this.state = {
            width: 900,
            height: 450,
        };
        this.chartRef = React.createRef();
    }
    
    async componentDidMount() {
        let data = await this.processData();
        this.chartRender(await data, 'approve', "#approval", 'approve_estimate', 'red');
        this.chartRender(await data, 'disapprove', "#disapproval", 'disapprove_estimate', 'blue');

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

    getWidth(){
        return this.chartRef.current.parentElement.offsetWidth;
    };

    getHeight(){
        return this.chartRef.current.parentElement.offsetHeight;
    };

    setData(data) {
        this.setState({ trumpApproval: data });
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
        console.log('trumpApproval: ', this.state.trumpApproval)
        return await csvSort;
    };

    //only works with top level element
    //need to find equivelent to document.querySelectorAll('.trump-ratings').target.closest('.approval')
    handleMouseOver(d, i) {  // Add interactivity
        // Use D3 to select element, change color and size
        d3.select(this)
            .attr("fill", "orange")
            .attr("r", d => 10 )
        console.log('hover')
    };

    handleMouseOut(d, i) {
        // Use D3 to select element, change color back to normal
        d3.select(this)
            .attr("r", d => 2);
    };

    chartRender = async (data, id, div, measure, color) => {
        const filtered = await data.filter(data => data.subgroup == "All polls");
        const flength = await filtered.length;
        d3.select(div)
            .append("svg")
            .attr("width", this.state.width)
            .attr("height", this.state.height)
            .attr("padding", '10px')
            .attr("class", 'trump-rating')
            .selectAll("circle")
            .data(filtered)
            .enter()
            .append("circle")
            .attr("class", d => id + '_' + d.subgroup)
            .attr("id", d => id + '_' + d.modeldate)
            .attr("cx", (d, i) => {
                return (i)*(this.state.width/flength);
            })
            .attr("cy", (d) => {
                const meas = eval( 'd.' + measure);
                return ((100-meas) * (this.state.height/100));
            })
            .attr("r", d => 2 )
            .style("fill", d => color)
            .on("mouseover", this.handleMouseOver)
            .on("mouseout", this.handleMouseOut)
    };

    render() {
        // const { width, height, trumpApproval } = this.state; 
        return (
            <div id='trumpApproval' style={styles.trumpApproval}>
                <div id='approval' style={styles.approval}></div>
                <div id='disapproval' style={styles.disapproval}></div>
            </div>
        )
    };

    
};

const styles = {
    trumpApproval: {
        margin: 10,
        padding:10
    },
    approval: {
        display: 'absolute',
    },
    disapproval: {
        display: 'absolute',
        marginTop: '-450px',
        
    }
}
            