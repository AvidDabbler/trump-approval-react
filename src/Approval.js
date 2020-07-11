import React, { Component } from 'react';
import * as d3 from 'd3';
import { findByLabelText } from '@testing-library/react';

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


class Slider extends Component {
    constructor(props) {
		super(props);
        this.state = {
            value: 3
        };
        // this.chartRef = React.createRef();
    }
    componentDidMount() {
        this.getInitialState();
    }
    getInitialState() {
        return {value: 3};
    }
    handleChange(event) {
        this.setState({value: event.target.value});
    }
    render() {
        return (
            <div class="slidecontainer">
                <input 
                    id="typeinp" 
                    type="range" 
                    min="0" max="5" 
                    value={this.state.value} 
                    onChange={this.handleChange.bind(this)}
                    step="1"/>
            </div>
            
        )
    }
}

export default class Approval extends Component{
    constructor(props) {
		super(props);
        this.state = {
            width: 900,
            height: 450,
        };
        // this.chartRef = React.createRef();
    }
    
    async componentDidMount() {
        let data = await this.processData();
        this.chartRender(await data, 'approve', "#trumpApproval");
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

    setDates() {

    }

    getWidth(){
        return this.chartRef.current.parentElement.offsetWidth;
    };

    getHeight(){
        return this.chartRef.current.parentElement.offsetHeight;
    };

    setData(data) {
        this.setState({ trumpApproval: data });
        return data;
    };
    
    setDates(data) {
        this.setState({
            minDate: data[1].old_date,
            maxDate: data[data.length-1].old_date
        },()=>console.log('state', this.state))
    }

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
        this.setDates(this.state.trumpApproval)

        console.log('trumpApproval: ', this.state.trumpApproval)
        return await csvSort;
    };

    

    //only works with top level element
    //need to find equivelent to document.querySelectorAll('.trump-ratings').target.closest('.approval')
    handleMouseOver(d, i) {  // Add interactivity
        // Use D3 to select element, change color and size          
        
        d3.select(this)
            .attr("r", d => 10)

    };

    handleMouseOut(d, i) {
        // Use D3 to select element, change color back to normal
        d3.select(this)
            .attr("r", d => 2);
    };

    chartRender = async (data, id, div) => {
        const filtered = await data.filter(data => data.subgroup == "All polls");
        const flength = await filtered.length;

        let svgChart = d3.select(div)
            .append('svg')
            .attr("width", '100%')
            .attr("height", 450)
            .selectAll('circle')
            .data(filtered)
            .attr("class", d => id + '_' + d.subgroup)
            .attr("id", d => id + '_' + d.modeldate)
            .enter();
        
        let svgLabel = d3.select(div)
            .append('div')
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .selectAll('p')
            .text("a simple tooltip")
        
        // approval render
        svgChart.append('circle')
            .attr("cx", (d, i) => {
                return (i)*(this.state.width/flength);
            })
            .attr("cy", (d) => {
                const meas = eval( 'd.' + 'approve_estimate');
                return ((100-meas) * (this.state.height/100));
            })
            .attr("r", d => 2 )
            .style("fill", d => 'red')
            .on("mouseover", this.handleMouseOver)
            .on("mouseout", this.handleMouseOut)


        // disapproval render
        svgChart.append("circle")
            .attr("cx", (d, i) => {
                return (i)*(this.state.width/flength);
            })
            .attr("cy", (d) => {
                const meas = eval( 'd.' + 'disapprove_estimate');
                return ((100-meas) * (this.state.height/100));
            })
            .attr("r", d => 2 )
            .style("fill", d => 'blue')
            .on("mouseover", this.handleMouseOver)
            .on("mouseout", this.handleMouseOut)
        
        svgLabel.append('p')
            .attr("cx", (d, i) => {
                return (i)*(this.state.width/flength);
            })
            .attr("cy", (d) => {
                const meas = eval( 'd.' + 'disapprove_estimate');
                return ((100-meas) * (this.state.height/100));
            })
            .on('mouseover', () => svg.style('visibility', 'visible'))
        
    };



    render() {
        // const { width, height, trumpApproval } = this.state; 
        return (
            <div id='approvalContainer'>
                <Slider />
                <div id='trumpApproval' style={styles.trumpApproval}></div>
            </div>
        )
    };

    
};

const styles = {
    trumpApproval: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        justifyContent: 'center',
        width: '90%',
        height:450
    },
    approval: {
        display: 'absolute',
    },
    disapproval: {
        display: 'absolute',
        marginTop: '-450px',
        
    }
}
            