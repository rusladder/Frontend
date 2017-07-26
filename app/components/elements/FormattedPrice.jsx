import React, { PropTypes } from "react";
import { formatDecimal } from 'app/utils/ParsersAndFormatters';

export default class FormattedPrice extends React.Component {

    static propTypes = {
        base: PropTypes.string,
        quote: PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { base, quote } = this.props;
        return (
            <span>{quote} / {base}</span>
        );
    }
}
