import React, { Component } from 'react';
import ReactMde, { ReactMdeCommands } from 'react-mde';

import 'react-mde/lib/styles/css/react-mde.css'
import 'react-mde/lib/styles/css/react-mde-command-styles.css'
import 'react-mde/lib/styles/css/markdown-default-theme.css'


export default class MarkdownEditor extends Component {

    constructor() {
        super();
        this.state = {
            reactMdeValue: {text: '', selection: null},
        };
    }

    handleValueChange = (value) => {
        this.setState({reactMdeValue: value});
    }

    render() {
        return (
            <div className="container">
                <ReactMde
                    textAreaProps={{
                        id: 'ta1',
                        name: 'ta1',
                    }}
                    value={this.state.reactMdeValue}
                    onChange={this.handleValueChange}
                    commands={ReactMdeCommands}
                />
            </div>
        );
    }
}