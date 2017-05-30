import React, { Component } from 'react';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';

export default class MathView extends Component {
    static propTypes = {
        formula : React.PropTypes.string.isRequired
    };

    constructor() {
        super();
        this.state = {
            formulaImg : '',
            isLoaded : false,
            isError: false
        }
    }

    fetchRenderedImage = (formula) => {
        formula = formula.replace(/\$latex|\$/g,'')
        const requestURl = '/embed/v1/math/';
        fetch(requestURl, {
            method: 'POST',
            body: encodeURIComponent(formula)
        })
        .then((response) => {
            if (response.ok) return response.json();
            else return Promise.reject(response.status);
        })
        .then((json) => {
            if (json && json.success) {
                this.setState({formulaImg : json.img, isLoaded: true});
            } else {
                throw new Error("status 404 " + requestURl);
            }
        })
        .catch((e)=> {
            this.setState({isError: true});
            console.log("formula request failed " + e);
        });
    }

    componentDidMount() {
        this.fetchRenderedImage(this.props.formula);
    }

    render() {
        const isLoaded = this.state.isLoaded;
        const isError = this.state.isError;
        return (
            <div style={{display: 'inline-block'}}>
                { !isLoaded && !isError && <LoadingIndicator type="circle" /> }
                { isLoaded && !isError && <img src={this.state.formulaImg} /> }
                { isError && <span>{this.props.formula}</span> }
            </div>
        );
    }
}