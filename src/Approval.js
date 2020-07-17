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
        this.dateChange= this.dateChange.bind(this)
        this.updateMax= this.updateMax.bind(this)
        this.updateMin= this.updateMin.bind(this)
        // this.handleMouseOver= this.handleMouseOver.bind(this)
    }
    getHeight(element) {
        if (element && !this.state.elementHeight) { // need to check that we haven't already set the height or we'll create an infinite render loop
          this.setState({ elementHeight: element.clientHeight });
        }
    }
    getWidth(element) {
        if (element && !this.state.elementWidth) { // need to check that we haven't already set the height or we'll create an infinite render loop
        //   this.setState({ elementWidth: element.clientWidth });
        }
      }
    
    async componentDidMount() {
        let data = await this.processData();
        // this.setState({
        //     elementHeight: this.divRef.clientHeight,
        //     elementWidth: this.divRef.clientWidth
        // });
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

    setDates() {

    }

    getWidth(){
        return this.chartRef.current.parentElement.offsetWidth;
    };

    getHeight(){
        return this.chartRef.current.parentElement.offsetHeight;
    };

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

    //only works with top level element
    //need to find equivelent to document.querySelectorAll('.trump-ratings').target.closest('.approval')


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
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
      
        
        // approval render
        svgChart.selectAll('circle')
            .data(filtered)
            .attr("class", d => id + '_' + d.subgroup)
            .attr("id", d => id + '_' + d.modeldate)
            .enter()
            .append('circle')
            .attr("cx", (d, i) => {
                return (i)*(this.state.width/flength);
            })
            .attr("cy", (d) => {
                const meas = eval( 'd.' + 'approve_estimate');
                return ((100-meas) * (this.state.height/100));
            })
            .attr("r", d => 3 )
            .style("fill", d => 'red')
            .on("mouseover", function(d){return tooltip.style("visibility", "visible").text(d.approve_estimate)})
            .on("mousemove", function () {
                return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", function () { return tooltip.style("visibility", "hidden"); })
            .enter()
            .data(filtered)
            .attr("class", d => id + '_' + d.subgroup)
            .attr("id", d => id + '_' + d.modeldate)
            .enter()
            .append('circle')
            .attr("cx", (d, i) => {
                return (i)*(this.state.width/flength);
            })
            .attr("cy", (d) => {
                return ((100-d.disapprove_estimate) * (this.state.height/100));
            })
            .attr("r", d => 3 )
            .style("fill", d => 'blue')
            .on("mouseover", function(d){return tooltip.style("visibility", "visible").text(d.disapprove_estimate)})
            .on("mousemove", function () {
                return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
        
            
        

        // // disapproval render
        // svgChart.selectAll('circle')
        //     .data(filtered)
        //     .attr("class", d => id + '_' + d.subgroup)
        //     .attr("id", d => id + '_' + d.modeldate)
        //     .enter()
        //     .append("circle")
        //     .attr("cx", (d, i) => {
        //         return (i)*(this.state.width/flength);
        //     })
        //     .attr("cy", (d) => {
        //         const meas = eval( 'd.' + 'disapprove_estimate');
        //         return ((100-meas) * (this.state.height/100));
        //     })
        //     .attr("r", d => 2 )
        //     .style("fill", d => 'blue')
        //     .on("mouseover", this.handleMouseOver)
        //     .on("mouseout", this.handleMouseOut)
        
        // svgLabel.append('p')
        //     .attr("cx", (d, i) => {
        //         return (i)*(this.state.width/flength);
        //     })
        //     .attr("cy", (d) => {
        //         const meas = eval( 'd.' + 'disapprove_estimate');
        //         return ((100-meas) * (this.state.height/100));
        //     })
        //     .on('mouseover', () => svg.style('visibility', 'visible'))
        
    };


    handleMouseOver(d, i) {  
        d3.select(this)
            .attr("r", d => 10)
     };
    
    // handleMouseOverText(d, i) {  
    //     d3.select(this)
    //         .attr('class', 'visible')
    //  };

    handleMouseOut(d, i) {
        // Use D3 to select element, change color back to normal
        d3.select(this)
            .attr("r", d => 2);
    };

    dateFilter() {
        // return this.state.trumpApproval.filter(item => {
        //     item.
        // })
    }

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

    dateChange() {
        console.log(this.state);
        
    }
    

    render() {
        const { minDate, maxDate } = this.state; 
        console.log(this.state)
        return (
            <div
                id='approvalContainer'
                style={this.approvalContainer}
            >
            {/* <DateSlider /> */}
            <form>
              <label>Start Date: </label>
                    <input
                        id='start' type="date"
                        defaultValue={minDate}
                        onChange={this.updateMin}
                        min={minDate}
                        max={maxDate}
                    ></input>
              <label>End Date: </label>
                    <input
                        id='end'
                        type="date"
                        defaultValue={maxDate}
                        onChange={this.updateMax}
                        min={minDate}
                        max={maxDate}
                    ></input>
                </form>
                <button id="trumpApprovalSubmit" onClick={this.dateChange}>
                    submit
                </button>
                <div id='trumpApproval' style={styles.trumpApproval}></div>
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
            