import React, {Component, PropTypes} from "react";
import {connect} from 'react-redux';
import Userpic from 'app/components/elements/Userpic';
import Icon from 'app/components/elements/Icon'
import {parsePayoutAmount} from 'app/utils/ParsersAndFormatters';
import LocalizedCurrency, {localizedCurrency} from 'app/components/elements/LocalizedCurrency';
import ctainfo from './ctainfo'

class CTABlock extends Component {

    static propTypes = {
        user: React.PropTypes.string.isRequired,
        post: React.PropTypes.string.isRequired,
        payout: React.PropTypes.number,
        visible: React.PropTypes.bool,
        special: React.PropTypes.object,
        currency: React.PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({loading: true})
    }

    componentDidMount() {
        var self = this;
        setTimeout(() => {
            self.setState({loading: false});
        }, 1000);
    }

    render() {
        let {
            user,
            post,
            payout,
            visible,
            special,
            potsOfMoney,
            defaultText,
            currency
        } = this.props

        let textBlock;

        if (special) {
            textBlock = <div className='column large-8 medium-8 small-8'>
            <p className='left cta-block-text-special'>
                {ctainfo.specialStartText} <b>{user}</b> {special.text} <a href={'/start'}>
                    {ctainfo.specialEndText}</a>
            </p>
            </div>
        } else if (potsOfMoney) {
            textBlock = <div className='column large-8 medium-8 small-8'>
                <p className='left cta-block-text-regular'>
                    Сообщество <b>Golos.io</b> {ctainfo.regularStartText} <b>{user}</b> заработал более
                </p>
                    <LocalizedCurrency amount={payout} rounding={true} noSymbol={true}/>
                <p className='left cta-block-text-regular'>&nbsp;{currency}.&nbsp;</p>
                <a href={'/start'}>{ctainfo.regularEndText}</a>
            </div>
        } else {
            textBlock = <div className='column large-8 medium-8 small-8'>
                <p className='left cta-block-text-default'>
                    <b>{ctainfo.defaultText.signup}</b>{ctainfo.defaultText.body}
                    <b>{ctainfo.defaultText.receive}</b>
                    {ctainfo.defaultText.for}
                    <b>{ctainfo.defaultText.rewards}</b> <a href={'/start'}>{ctainfo.defaultText.more}</a>.
                </p>
            </div>
        }

        let ctablock = <div className='ctablock'>
            <div className='row'>
                {defaultText
                    ? <div className='hide-for-small-only column large-1 medium-1 small-1'>
                        <Icon name='golos' size='3x'/>
                        </div>
                    : <div className='hide-for-small-only column large-1 medium-1 small-1'>
                        <Userpic account={user}/>
                    </div>}
                {textBlock}
                <div className='column large-3 medium-3 small-3'>
                    <a href="/create_account" className="button">Создать аккаунт</a>
                </div>
            </div>
        </div>

        if (this.state.loading) 
            return null
        else 
            return (visible
                ? ctablock
                : null)
        }
}

export default connect((state, ownProps) => {

    const post = state
            .global
            .getIn(['content', ownProps.post])
        if (!post) 
            return ownProps

        let current_account = state
                .user
                .get('current')
            let user = post.get('author')

                let link = post.get('category') + '/@' + user + '/' + post.get('permlink')

                    function compareLinks(specialLink, incomingLink) {
                        return specialLink === incomingLink;
                    }

                    function isSpecialPost(array, link) {
                        for (let i = 0; i < array.length; i++) {
                            if (compareLinks(array[i].link, link)) {
                                return array[i]
                            }
                        }
                    }

                    let showMinCurrency,
                        currency,
                        currentCurrency;

                    if (process.env.BROWSER) 
                        currentCurrency = localStorage.getItem('xchange.picked')

                    if (currentCurrency) 
                        if (currentCurrency == 'RUB') {
                            showMinCurrency = ctainfo.minRubValueToShow
                            currency = ctainfo.rub
                        }
                    else if (currentCurrency == 'USD') {
                        showMinCurrency = ctainfo.minUsdValueToShow
                        currency = ctainfo.usd
                    } else {
                        showMinCurrency = ctainfo.minRubValueToShow
                        currency = currentCurrency
                    }

                    let visible = current_account == null

                    let pending_payout = parsePayoutAmount(post.get('pending_payout_value'))
                    let total_author_payout = parsePayoutAmount(post.get('total_payout_value'))
                    let total_curator_payout = parsePayoutAmount(post.get('curator_payout_value'))
                    let payout = (pending_payout + total_author_payout + total_curator_payout)
                    let localizedPayoutValue = localizedCurrency(payout, {
                        noSymbol: true,
                        rounding: true
                    })

                    let special = isSpecialPost(ctainfo.specialLinks, link)
                    let potsOfMoney = localizedPayoutValue >= showMinCurrency
                    let defaultText = !potsOfMoney && !special

                    return {
                        post: ownProps.post,
                        user,
                        payout,
                        visible,
                        potsOfMoney,
                        defaultText,
                        special,
                        currency
                    }
                })(CTABlock)