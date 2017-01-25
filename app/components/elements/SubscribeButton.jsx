/* eslint react/prop-types: 0 */
import React from 'react';
import Follow from 'app/components/elements/Follow';
import Icon from 'app/components/elements/Icon';
import { translate } from 'app/Translator';

const {string, bool, number} = React.PropTypes

class SubscribeButton extends React.Component {
    // static propTypes = {
    //     author: string.isRequired,
    //     follow: bool,
    //     mute: bool,
    //     authorRepLog10: number,
    // }
    // static defaultProps = {
    //     isFavorite: false,
    //     mute: true,
    // }

    state = {isFavorite: false}

    toggleFavorite = event => {
        event.preventDefault()
        this.setState({isFavorite: !this.state.isFavorite})
    }

    render() {
        const {isFavorite} = this.state
        const {className, ...rest} = this.props
        return  <a
                    href=""
                    className={"SubscribeButton " + className}
                    alt={translate(isFavorite ? 'subscribe' : 'unsubscribe')}
                    onClick={this.toggleFavorite}
                    {...rest}
                >
                    <Icon name={isFavorite ? "star" : "star-o"} size="1x" />
                </a>
    }
}

import {connect} from 'react-redux'
export default connect(
    (state, ownProps) => {
        const current = state.user.get('current')
        const username = current && current.get('username')
        return {
            ...ownProps,
            username,
        }
    },
    // dispatch => ({
    //     vote: (abc) => {
    //         dispatch(transaction.actions.broadcastOperation({
    //             abc
    //         }))
    //     },
    // })
)(SubscribeButton)
