import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import reactForm from 'app/utils/ReactForm';
import {List, Map, fromJS} from 'immutable';
import { Link } from 'react-router';
import Icon from 'app/components/elements/Icon';
import transaction from 'app/redux/Transaction';
import user from 'app/redux/User';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import {validate_account_name} from 'app/utils/ChainValidation';
import Userpic from 'app/components/elements/Userpic';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import Tooltip from 'app/components/elements/Tooltip';
import tt from 'counterpart';

const testData = {
  "usernames" : ["Irina Leland","Jessica Mcelravy","Alline Glynn","Really Long Long User Name","Deeanna Ling","Eloise Kenison","Gigi Kaup","Earline Rippeon","Jonell Dierking","Farrah Klumpp","Misti Mackiewicz","Soo Chaires","Adina Sobolik","Leeann Segraves","Dominique Cefalu","Deangelo Rouillard","Tereasa Korman","Shela Usher","Gerda Ranck","Olga Brimer","Brande Primmer","Mae Sohn","Heide Donelson","Sara Schulte","Aletha Walston","Vivien Fleury","Savannah Harsh","Matt Cowherd","Tatyana Stiner","Lorrine Salone","Jeromy Ackermann","Prudence Svendsen","Audie Lightfoot","Carlena Sweeney","Neva Thatch","Judson Charlesworth","Eddy Siddall","Lorie Lattin","Joan Normandin","Georgette Simien","Rex Pellegrin","Fiona Duran","Sona Bigby","Latarsha Kaelin","Hoyt Sporer","Harry Tillis","Kathlyn Hoye","Catherina Copenhaver","Arielle Wengerd","Bert Gundersen"],
  "useravatars": ["val","jazzycrypt","acidsun","knopki","marina","vi1son","on0tole","dicov","dr2073","arcange","illlefr4u","natalyt","crypto.owl","creatorgalaxy","smailer","spinner","litrbooh","asdes","denn","aleksandraz","ullikume","misha","zahar","erikkartmen","boddhisattva","anech512","xanoxt","elena-singer","dikanevroman","gennadij","dhrms","rusteemitblog","terem","russkaya","aim","natka2","ianboil","analise","cryptoknight","slidenergy","mayamarinero","econmag","kostikus","francisgrey","redhat","singularity","sept","mishka","saira","ukrainian","maksim","neo","alien","blackmoon","vako","park.bom","myrussia","dinamo","apteka","commodore","jet","bitcoinfo","cars","cats-02","rbrown","smotritelmayaka","boomerang","elenakorotkova","chiliec","seaside","huso","quasimax","psychologist","narin","fetta","andrvik","max-max","eduard","dmitriu","zoss","midnight","pavel.didkovsky","bambr","teror","mommo","awispa","andreyn","tarimta","annaart","lumia","sonik","vitarecord","sxiii","dajana","gammy","blockchained","art-auction","stepanov","harhor","naminutku"],
  "conversation": ["Would only join TPP if the deal were substantially better than the deal offered to Pres. Obama. We already have BILATERAL deals with six of the eleven nations in TPP, and are working to make a deal with the biggest of those  nations, Japan, who has hit us hard on trade for years!","You only like the 'TPP' because of the 'PP' part","How old are you? Good lord!","Oh come on, that was pretty funny.","Yeah, in the 3rd grade it was funny. Just wow. Who would have thought a presidential election would turn half the country into toddlers! 😂😂","Half of the country voted for the toddler.","yeah that was a tough talk to have with my kids that November morning.","Did you tell them the Country decided to not vote for a lying, corrupt, satanic nightmare of a human being?","You’re right, they didn’t. Less people voted for Trump and I think your description is accurate.","The Art of the Deal! Learn it, live it, love it!","Jacob Wohl: 5 Reasons Trump Should Take Out Bashar al-Assad","Now is the time to Bomb Bashar a-Assad and eliminate the entire Iranian proxy-regime in Syria","We need to send a message to North Korea by following through on Syria","Yes, some new brand of Sunni islamofascist nutcases will spring up if we take out Assad","The difference is, unlike with Obama, the next ISIS won't have the funding of the United States and (more importantly) Saudi Arabia","If we take out Assad, we can install a moderate leader. Think about what we did in Egypt.","If we are timid with Assad, Kim Jong Un will take advantage of us","Your lack of leadership is staggering. Sad.","‏You are a beta male"]
}

/** Warning .. This is used for Power UP too. */
class MessageBox extends Component {

    static propTypes = {
        // connector props
        username: React.PropTypes.string,
        history: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        gstatus: PropTypes.object.isRequired,
    };

    constructor(props) {
        super()
        this.state = {
            selected: null,
            sending: false
        };
        this.initForm(props)
    }

    initForm(props) {
        reactForm({
            instance: this,
            name: 'converstaionForm',
            fields: ['memo'],
            initialValues: props.initialValues,
            validation: values => ({
              memo: null
            })
        })
    }

    componentWillMount() {
      this.props.dispatchGetHistory({account: this.props.username});
    }

    componentDidMount() {}

    onSelectListItem = key => {
      this.setState({selected: key});
    }

    errorCallback = errorStr => {
      this.setState({trxError: errorStr, loading: false});
    }

    clearError = () => {
      this.setState({trxError: undefined});
    }

    onChangeMemo = (e) => {
      const {value} = e.target;
      this.state.memo.props.onChange(value);
    }

    dispatchSubmit = (formPayload) => {
      console.warn('formPayload', formPayload);
        const {dispatchSendMessage, username} = this.props;
        const {selected} = this.state;
        const memo = formPayload.memo;
        dispatchSendMessage({
            operation: {
                from: username,
                to: selected,
                amount: '0.001 GOLOS',
                memo: (memo ? memo : '')
            },
            errorCallback: this.errorCallback
        });
    }

    render() {
        const {selected, memo, converstaionForm : {handleSubmit}} = this.state;
        const {history, username, loading} = this.props;
        const fetching = false;
        const disabled = false;
        let tmp = {};
        history.reverse().map(item => {
            if (item.getIn([1, 'op', 0]) !== 'transfer') return;
            const data = item.getIn([1, 'op', 1]).toJS();
            const conversant = username === data.from ? data.to : data.from;
            if (typeof tmp[conversant] !== 'object') tmp[conversant] = [];
            tmp[conversant].push({
              from: data.from,
              to: data.to,
              amount: data.amount,
              memo: data.memo,
              timestamp: item.getIn([1, 'timestamp'])
            });
        });
        const conversantionsMap = Map(fromJS(tmp)).sort(
          (a, b) => new Date(a.getIn([0, 'timestamp'])) < new Date(b.getIn([0, 'timestamp']))
        );
        let selectedKey = selected;
        if (! selectedKey) {
          selectedKey = conversantionsMap.keySeq().first();
        }
        const conversantions = conversantionsMap.map((value, key) => {
            const memo = value.getIn([0, 'memo']);
            return <li key={`conversant-${key}`} className={key == selectedKey ? 'selected' : ''} onClick={() => this.onSelectListItem(key)}>
                <Tooltip className="timestamp" t={new Date(value.getIn([0, 'timestamp'])).toLocaleString()}>
                    <TimeAgoWrapper date={value.getIn([0, 'timestamp'])} />
                </Tooltip>
                <Userpic account={key} />
                <div className="right-side">
                    <strong>{key}</strong>
                    <small>{typeof memo !== 'string' ? JSON.stringify(memo) : memo}</small>
                </div>
            </li>
        });

        const conversation = conversantionsMap.get(selectedKey, Map()).reverse().map((value, key) => {
            return <li key={`conversation-item-${key}`}>
                <Userpic account={value.get('from')} width="36" height="36"/>
                <div className="right-side">
                    <strong>{value.get('from')}</strong>
                    <Tooltip className="timestamp" t={new Date(value.get('timestamp')).toLocaleString()}>
                        <TimeAgoWrapper date={value.get('timestamp')} />
                    </Tooltip>
                    <small>{value.get('memo')}</small>
                </div>
            </li>
        });

        return (<div className={'Messages row' + (fetching ? ' fetching' : '')}>
            <div className="Messages__left column shrink small-collapse">
                <div className="topbar">
                    <div className="row">
                        <div className="column small-10">
                            <input type="text" placeholder={tt("voting_jsx.search")} disabled={disabled} />
                        </div>
                        <div className="column small-2">
                            <Link to="/message.html"><Icon name="pencil" /></Link>
                        </div>
                    </div>
                </div>
                <ul className="List">
                    {conversantions}
                </ul>
            </div>
            <div className="Messages__right column show-for-large">
                <div className="topbar">
                    <div className="row">
                        <div className="column small-10">
                            <Userpic account={selectedKey} width="36" height="36"/>
                            <h6>{selectedKey}</h6>
                        </div>
                        <div className="column small-2"></div>
                    </div>
                </div>
                <ul className="Conversation">
                    {conversation}
                </ul>
                <div className="bottombar">
                  <form onSubmit={handleSubmit(({data}) => {this.dispatchSubmit({...data})})}>
                    <div className="row">
                        <div className="column small-10">
                            <input
                                {...memo.props}
                                type="text"
                                ref="memo"
                                placeholder={tt('g.reply')}
                                onChange={this.onChangeMemo}
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                                disabled={loading}
                            />
                        </div>
                        <div className="column small-2">
                            <button
                                type="submit"
                                className="button"
                                disabled={disabled}
                                onChange={this.clearError}
                            >
                                {tt('g.submit')}
                            </button>
                        </div>
                    </div>
                  </form>
                </div>
            </div>
        </div>)
    }
}

import {connect} from 'react-redux'

export default connect(
    (state, ownProps) => {
        const username = state.user.getIn(['current', 'username']);
        const history  = state.global.getIn(['accounts', username, 'transfer_history']);
        const loading  = state.app.get('loading');
        const gstatus   = state.global.get('status');
        const initialValues = {
            memo: null,
        }
        return {
            ...ownProps,
            initialValues,
            username,
            history,
            loading,
            gstatus,
        }
    },
    dispatch => ({
        dispatchGetHistory: ({account}) => {
          dispatch({type: 'FETCH_STATE', payload: {pathname: `@${account}/transfers`}})
        },
        dispatchSendMessage: ({
            operation,
            errorCallback,
        }) => {
            const successCallback = () => {
                dispatch({type: 'FETCH_STATE', payload: {pathname: `@${operation.from}/transfers`}})
            }
            dispatch(transaction.actions.broadcastOperation({
                type: 'transfer',
                operation,
                successCallback,
                errorCallback,
            }))
        }
    })
)(MessageBox)
