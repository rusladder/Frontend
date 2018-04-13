import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import reactForm from 'app/utils/ReactForm';
import {Map} from 'immutable';
import { Link } from 'react-router';
import Icon from 'app/components/elements/Icon';
import user from 'app/redux/User';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import {validate_account_name} from 'app/utils/ChainValidation';
import Userpic from 'app/components/elements/Userpic';
import tt from 'counterpart';

const testData = {
  "users" : ["Irina Leland","Jessica Mcelravy","Alline Glynn","Really Long Long User Name","Deeanna Ling","Eloise Kenison","Gigi Kaup","Earline Rippeon","Jonell Dierking","Farrah Klumpp","Misti Mackiewicz","Soo Chaires","Adina Sobolik","Leeann Segraves","Dominique Cefalu","Deangelo Rouillard","Tereasa Korman","Shela Usher","Gerda Ranck","Olga Brimer","Brande Primmer","Mae Sohn","Heide Donelson","Sara Schulte","Aletha Walston","Vivien Fleury","Savannah Harsh","Matt Cowherd","Tatyana Stiner","Lorrine Salone","Jeromy Ackermann","Prudence Svendsen","Audie Lightfoot","Carlena Sweeney","Neva Thatch","Judson Charlesworth","Eddy Siddall","Lorie Lattin","Joan Normandin","Georgette Simien","Rex Pellegrin","Fiona Duran","Sona Bigby","Latarsha Kaelin","Hoyt Sporer","Harry Tillis","Kathlyn Hoye","Catherina Copenhaver","Arielle Wengerd","Bert Gundersen"],
  "conversation": ["Would only join TPP if the deal were substantially better than the deal offered to Pres. Obama. We already have BILATERAL deals with six of the eleven nations in TPP, and are working to make a deal with the biggest of those  nations, Japan, who has hit us hard on trade for years!","You only like the 'TPP' because of the 'PP' part","How old are you? Good lord!","Oh come on, that was pretty funny.","Yeah, in the 3rd grade it was funny. Just wow. Who would have thought a presidential election would turn half the country into toddlers! 😂😂","Half of the country voted for the toddler.","yeah that was a tough talk to have with my kids that November morning.","Did you tell them the Country decided to not vote for a lying, corrupt, satanic nightmare of a human being?","You’re right, they didn’t. Less people voted for Trump and I think your description is accurate.","The Art of the Deal! Learn it, live it, love it!","Jacob Wohl: 5 Reasons Trump Should Take Out Bashar al-Assad","Now is the time to Bomb Bashar a-Assad and eliminate the entire Iranian proxy-regime in Syria","We need to send a message to North Korea by following through on Syria","Yes, some new brand of Sunni islamofascist nutcases will spring up if we take out Assad","The difference is, unlike with Obama, the next ISIS won't have the funding of the United States and (more importantly) Saudi Arabia","If we take out Assad, we can install a moderate leader. Think about what we did in Egypt.","If we are timid with Assad, Kim Jong Un will take advantage of us","Your lack of leadership is staggering. Sad.","‏You are a beta male"]
}

/** Warning .. This is used for Power UP too. */
class MessageBox extends Component {

    static propTypes = {}

    constructor(props) {
        super()
        this.state = {selected: 0};
    }

    componentDidMount() {}

    onSelectListItem = index => {
      this.setState({selected: index});
    }


    render() {
      const { selected } = this.state;
        const fetching = false;
        const disabled = false;
        const randomInt = ((min, max) => {return Math.floor(Math.random() * (max - min + 1)) + min;});
        const getLorem = (len => {const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."; return lorem.substr(0,len); })
        let odd = true;
        const userList = <ul className="List">
            <li className="top-bar">
              <input type="text" placeholder={tt("voting_jsx.search")} disabled={disabled} />
              <Link to="/message.html"><Icon name="pencil" /></Link>
            </li>
            {testData.users.map((key, index) => {
                odd = !odd;
                return <li key={`user-${index}`} className={index == selected ? 'selected' : ''} onClick={() => this.onSelectListItem(index)}>
                  <Userpic account={odd ? index : "golosio"} />
                  <div className="right-side"><strong>{key}</strong><small>{getLorem(randomInt(15, 50))}</small></div>
                </li>
            })}
        </ul>;
        const conversation = <ul className="Conversation">
            {testData.conversation.map((key, index) => {
                odd = !odd;
                return <li key={`conv-${index}`} className={index == selected ? 'selected' : ''}>
                    <Userpic account={odd ? testData.users[selected] : "golosio"} width="36" height="36"/>
                    <div className="right-side">
                        <strong>{odd ? testData.users[selected] : "golosio"}</strong>
                        <small>{key}</small>
                    </div>
                </li>
            })}
            <li className="bottom-bar">
              <textarea
                disabled={disabled}
                placeholder={tt('g.reply')}
                autoComplete="off"
              />
            </li>
        </ul>

        return (<div className={'Messages row' + (fetching ? ' fetching' : '')}>
            <div className="Messages__left column shrink small-collapse">
              <div className="Messages__left__finder">
              </div>
              {userList}
            </div>
            <div className="Messages__right column show-for-large">
            {conversation}
            </div>
        </div>)
    }
}

import {connect} from 'react-redux'

export default connect(
    (state, ownProps) => {
        return {...ownProps}
    },
    dispatch => ({
        dispatchSome: ({a}) => {}
    })
)(MessageBox)
