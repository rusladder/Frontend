import React from 'react'
import {Link} from 'react-router';
import Userpic from 'app/components/elements/Userpic';
import iconCross from 'app/assets/icons/cross.svg'
import iComment from 'app/assets/icons/notification/comment.png'
// import iTransfer from 'app/assets/icons/notification/transfer.svg'
import iVoteUp from 'app/assets/icons/notification/vote_up.png'
// import iVoteDown from 'app/assets/icons/notification/vote_down.svg'
//
const actionStyle = {
  // fixme
  paddingTop: '2px',
  // paddingLeft: '11px',
  // paddingRight: '0px',
  display: 'flex',
  height: '100%',
  alignItems: 'center',
}
//
const cross = () => <span className="NotificationContent__action" dangerouslySetInnerHTML={{__html: iconCross}}/>
//
const transfer = data => {
  // console.log('~~~~~~~~~~~~ ', data)
  const {
    from: {
      account,
      profile_image
    },
    to,
    amount,
    memo
  } = data;
  // todo use i18n const
  const message = ` перевел вам ${amount}.`
  //
  return (
    <div className="NotificationContent__container">
      <div className="NotificationContent__container_left">
        <Userpic width="37" height="37" imageUrl={profile_image}/>
      </div>
      <div className="NotificationContent__container_center">
        <Link to={`/@${to}/transfers`}>
          <span className="NotificationContent__action_source">
            {account}
            <span style={{color: '#919191', fontWeight: '450'}}>
              {message}
            </span>
          </span>
        </Link>
      </div>
    </div>
  )
}
//
const comment = data => {
  // console.log('~~~~~~~~~~~~ ', data)
  // console.log(data)
  // todo use i18n const
  const {
    comment_url,
    author: {
      account,
      profile_image
    },
    parent: {
      type,
      // todo refactor url const names
      url: parent_url
    },
    count
  } = data;
  //
  const oncePerBlock = true//(count === 1);
  //
  const message = oncePerBlock ?
    <span>
      {` ответил на ваш`}
      &nbsp;
      <Link to={parent_url}>
        {type === 'post' ? `пост` : `комментарий`}
      </Link>
    </span> :
    <span>
      {`На ваш`}
      &nbsp;
      <Link to={parent_url}>
        {type === 'post' ? `пост` : `комментарий`}
      </Link>
      {` ответили ${count} раз.`}
    </span>
  //
  return (
    <div style={{display: 'flex', padding: '0.5rem'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1rem'}}>
        {
          <img src={iComment} style={{width: '1rem', height: '1rem'}}/>
        }
      </div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1rem'}}>
        {
          oncePerBlock ? <Userpic width="37" height="37" imageUrl={profile_image}/> :
            <span className="NotificationContent__icon" dangerouslySetInnerHTML={{__html: commentMulti}}/>
        }
      </div>
      <div style={{display: 'flex', alignItems: 'center'}}>
          <span >
            {oncePerBlock && account}
            <span style={{color: 'lightgrey'}}>
              {message}
            </span>
          </span>
      </div>
    </div>
  )
}
//
const upvote = data => {
  // console.log('++++++++++++++++ ', data)
  // console.log(data)
  // todo use i18n const
  const {
    voter: {
      account,
      profile_image
    },
    parent: {
      type,
      // todo refactor url const names
      url: parent_url
    },
    // no aggregations for now
    // count
  } = data;
  //
  const oncePerBlock = true;//(count === 1);
  //
  const message = oncePerBlock ?
    <span>
      {` поддержал ваш`}
      &nbsp;
      <Link to={parent_url}>
        {type === 'post' ? `пост` : `комментарий`}
      </Link>
    </span> :
    <span>
      {`За ваш`}
      &nbsp;
      <Link to={parent_url}>
        {type === 'post' ? `пост` : `комментарий`}
      </Link>
      {` проголосовали ${count} раз.`}
    </span>
  //
  return (
    <div style={{display: 'flex', padding: '0.5rem'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1rem'}}>
        {
          <img src={iVoteUp} style={{width: '1rem', height: '1rem'}}/>
        }
      </div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1rem'}}>
        {
          oncePerBlock ? <Userpic width="37" height="37" imageUrl={profile_image}/> :
            <span className="NotificationContent__icon" dangerouslySetInnerHTML={{__html: upVoteMulti}}/>
        }
      </div>
      <div style={{display: 'flex', alignItems: 'center'}}>
          <span>
            {oncePerBlock && account}
            <span style={{color: 'lightgrey'}}>
              {message}
            </span>
          </span>
      </div>
    </div>
  )
}
//
const downvote = data => {
  // console.log('~~~~~~~~~~~~ ', data)
  // console.log(data)
  // todo use i18n const
  const {
    voter: {
      account,
      profile_image
    },
    parent: {
      type,
      permlink,
      title,
      body,
      // todo refactor url const names
      url: parent_url
    },
    count
  } = data;
  //
  const oncePerBlock = (count === 1);
  //
  const message = oncePerBlock ?
    <span>
      {` поставил флаг на ваш`}
      &nbsp;
      <Link to={parent_url}>
        {type === 'post' ? `пост` : `комментарий`}
      </Link>
    </span> :
    <span>
      {`Ваш`}
      &nbsp;
      <Link to={parent_url}>
        {type === 'post' ? `пост` : `комментарий`}
      </Link>
      {` получил ${count} флага.`}
    </span>
  //
  return (
    <div className="NotificationContent__container">
      <div className="NotificationContent__container_left">
        {
          oncePerBlock ? <Userpic width="37" height="37" imageUrl={profile_image}/> :
            <span className="NotificationContent__icon" dangerouslySetInnerHTML={{__html: downVoteMulti}}/>
        }
      </div>
      <div className="NotificationContent__container_center">
          <span className="NotificationContent__action_source">
            {oncePerBlock && account}
            <span style={{color: '#919191', fontWeight: '450'}}>
              {message}
            </span>
          </span>
      </div>
    </div>
  )
}
//
export default function notificationsLogItem(itemTuple) {
  // console.log(`))))))) `, what)
  let [id, , timestamp, type, , , payload] = itemTuple;
  // fixme temporary - should not be here
  payload = JSON.parse(payload)
  // return (<div className="row" key={id}>{type}</div>)
  return (
    type === 'comment' ? comment(payload) :
      type === 'transfer' ? transfer(payload) :
        type === 'voteup' ? upvote(payload) :
          downvote(payload)
  )
}
// //
// export default action => ({
//   // the following two are merged by react-notification
//   // and overload .notification-bar css class
//   barStyle: {},
//   activeBarStyle: {
//     // left: 'auto',
//     // right: '1rem',
//     // transition: '',
//     // transitionProperty: 'right',
//     // transitionDuration: '.5s',
//     // transitionTimingFunction: 'cubic-bezier(0.89, 0.01, 0.5, 1.1)',
//     background: '#FFFFFF',
//     borderRadius: '6px',
//     paddingTop: '11px',
//     paddingBottom: '11px',
//     paddingLeft: '21px',
//     paddingRight: '14px'
//   },
//   // title can be inline-styled
//   title: render(action),
//   titleStyle: {
//     display: 'flex',
//     alignItems: 'center',
//     height: '100%',
//     // override react-notification
//     marginRight: '0px'
//   },
//   message: '',
//   action:
//     <span style={actionStyle}>
//       {cross()}
//     </span>,
//   actionStyle: {
//     // background: 'red',
//     padding: '0px',
//     marginLeft: '18px',
//     color: 'blue',
//     font: '.75rem normal Roboto, sans-serif',
//     lineHeight: '1rem',
//     letterSpacing: '.125ex',
//     textTransform: 'uppercase',
//     borderRadius: '0px',
//     cursor: 'pointer'
//   },
//   key: "chain_" + Date.now(),
//   dismissAfter: 15000,
// })
