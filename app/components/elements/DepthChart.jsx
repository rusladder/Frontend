import React, { Component, PropTypes } from 'react';
const ReactHighcharts = require("react-highcharts/dist/ReactHighstock");
import tt from 'counterpart';
import { power, ordersEqual, generateBidAsk, getMinMax } from 'app/utils/OrdersUtils'

// Highstock does not play well with decimal x values, so we need to
// multiply the x values by a constant factor and divide by this factor for
// display purposes (tooltip, x-axis)
const precision = 1000;
const chartConfig = {
    title: { text: null },
    subtitle: { text: null },
    chart: { type: 'area', zoomType: 'x' },
    legend: { enabled: false },
    credits: { enabled: false },
    rangeSelector: { enabled: false },
    navigator: { enabled: false },
    scrollbar: { enabled: false },
    dataGrouping: { enabled: false },
    plotOptions: { series: { animation: false } },
}

export default class DepthChart extends Component {

    static propTypes = {
        base: PropTypes.string,
        quote: PropTypes.string,
        bids: PropTypes.array,
        asks: PropTypes.array,
        precision: PropTypes.number
    };

    shouldComponentUpdate(nextProps) {
        // Don't update if the orders are the same as last time
        if (ordersEqual(nextProps.bids, this.props.bids) && ordersEqual(nextProps.asks, this.props.asks)) {
            return false;
        }

        // Use HighCharts api once the chart has been initialized
        if (this.refs.depthChart) {
            // Only use the HighCharts api when both bids and asks already exist
            const chart = this.refs.depthChart.getChart();
            if (chart && "series" in chart && chart.series.length === 2) {
                const {bids, asks} = generateBidAsk(nextProps.bids, nextProps.asks);
                const {min, max} = getMinMax(bids, asks);

                chart.series[0].setData(bids);
                chart.series[1].setData(asks);
                chart.xAxis[0].setExtremes(min, max);
                return false;
            }
        }
        return true;
    }

    render() {
        const { base, quote } = this.props;
        if (!this.props.bids.length && !this.props.asks.length) {
            return null;
        }

        const series = [];
        const { bids, asks } = generateBidAsk(this.props.bids, this.props.asks);
        const { min, max } = getMinMax(bids, asks);
    
        if(process.env.BROWSER) {
            if(bids[0]) {
                series.push({
                    step: 'right',
                    name: tt('g.bid'),
                    color: 'rgba(0,150,0,1.0)',
                    fillColor: 'rgba(0,150,0,0.2)',
                    tooltip: {
                        valueSuffix: ` ${quote}`
                    },
                    data:  bids
                })
            }
            if(asks[0]) {
                series.push({
                    step: 'left',
                    name: tt('g.ask'),
                    color: 'rgba(150,0,0,1.0)',
                    fillColor: 'rgba(150,0,0,0.2)',
                    tooltip: {
                        valueSuffix: ` ${quote}`
                    },
                    data: asks
                })
            }
        }
    
        const config = {
            ...chartConfig,
            series,
            xAxis: {
                min: min,
                max: max,
                labels: {
                    formatter: function() {
                        return this.value / power 
                    } 
                },
                ordinal: false,
                lineColor: "#000000",
                title: { text: null }
            },
            yAxis: {
                labels: {
                    align: "left",
                    formatter: function () {
                        return this.value / precision // utils.format_number(this.value, quote.precision))
                    }
                },
                lineWidth: 2,
                gridLineWidth: 1,
                title: { text: null }
            },
            tooltip: {
                shared: false,
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                formatter: function() {
                    return `
                        <span>${tt('g.price')}: ${(this.x / power).toFixed(6)} ${base}/${quote}</span>
                        <br/>
                        <span>${this.series.name}: ${(this.y / 1000).toFixed(3)} ${quote}</span>
                    ` // !!!
                },
                style: {
                    color: "#FFFFFF"
                }
            }
        };
        
        return (
            <div className="DepthChart">
                <ReactHighcharts ref="depthChart" config={config} />
            </div>
        );
    }
}
