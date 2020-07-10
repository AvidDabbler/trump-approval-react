import React, { Component } from 'react';
import * as d3 from 'd3';


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

    chartRender = async (data, id, div, measure, color) => {
        const filtered = await data.filter(data => data.subgroup == "All polls");
        const flength = await filtered.length;
        d3.select(div)
            .append("svg")
            .attr("width", this.state.width)
            .attr("height", this.state.height)
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
    };

    render() {
        // const { width, height, trumpApproval } = this.state; 
        return (
            <div>
                <div id='approval'></div>
                <div id='disapproval'></div>
            </div>
        )
    };
};

            