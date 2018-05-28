import React from 'react'
import {Link} from 'react-router';
import Userpic from 'app/components/elements/Userpic';
import iComment from 'app/assets/icons/notification/comment.svg'
import iTransfer from 'app/assets/icons/notification/transfer.svg'
import iVoteUp from 'app/assets/icons/notification/upvote.svg'
import iVoteDown from 'app/assets/icons/notification/downvote.svg'
//
export default function notificationsLogItem(itemTuple) {
  // console.log(`))))))) `, what)
  let [id, , timestamp, type, , , payload] = itemTuple;
  // fixme temporary - should not be here
  payload = JSON.parse(payload)
  //
  let icon;
  let image;
  let source;
  let message;
  //
  switch (type) {
    //
    case 'comment': {
      const {
        comment_url,
        author: {
          account,
          profile_image
        },
        parent: {
          type: contentType,
          // todo refactor url const names
          url: parent_url
        },
        count
      } = payload;
      //
      icon = iComment;
      image = profile_image
      source = account
      message = (
        <span>
          &nbsp;
          {`ответил на ваш`}
          &nbsp;
          <Link to={parent_url}>
            {contentType === 'post' ? `пост` : `комментарий`}
          </Link>
        </span>
      )
      break
    }
    //
    case 'transfer': {
      const {
        from: {
          account,
          profile_image
        },
        amount,
      } = payload;
      //
      icon = iTransfer
      image = profile_image
      source = account
      message = ` перевел вам ${amount}.`
      break
    }
    //
    case 'voteup': {
      const {
        voter: {
          account,
          profile_image
        },
        parent: {
          type: contentType,
          // todo refactor url const names
          url: parent_url
        },
        // no aggregations for now
        // count
      } = payload;
      //
      icon = iVoteUp;
      image = profile_image
      source = account
      message = (
        <span>
          &nbsp;
          {`поддержал ваш`}
          &nbsp;
          <Link to={parent_url}>
            {contentType === 'post' ? `пост` : `комментарий`}
          </Link>
        </span>
      )
      break
    }
    //
    case 'votedown': {
      const {
        voter: {
          account,
          profile_image
        },
        parent: {
          type: contentType,
          // todo refactor url const names
          url: parent_url
        },
        count
      } = payload;
      //
      icon = iVoteDown
      image = profile_image
      source = account
      message = (
        <span>
          &nbsp;
          {`поставил флаг на ваш`}
          &nbsp;
          <Link to={parent_url}>
            {type === 'post' ? `пост` : `комментарий`}
          </Link>
        </span>
      )
      break
    }
    //
    default:
      break
  }


  return (
    <div style={{
      display: 'flex',
      padding: '1.5rem 0.5rem 0',
      // background: 'green'
    }}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '1rem'}}>
        <span className="notification-log-item__type-icon" dangerouslySetInnerHTML={{__html: icon}} />
      </div>
      <div style={{
        // background: 'yellow',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: '1.5rem'
      }}>
        {
          <Userpic width="37" height="37" imageUrl={image} />
        }
      </div>
      <div style={{
        // background: 'lightblue',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        paddingLeft: '1.2rem',
        fontSize: '14px',
        fontWeight: 300
      }}>
          <span style={{verticalAlign: 'top'}}>
            <span style={{fontWeight: 500}}>
              {source}
            </span>
            <span style={{fontWeight: 300}}>
              {message}
            </span>
          </span>
          <span style={{
            fontSize: '12px',
            fontWeight: 300
          }}>
            Два часа назад
          </span>
      </div>
    </div>

  )


  // return (
  //   type === 'comment' ? comment(payload) :
  //     type === 'transfer' ? transfer(payload) :
  //       type === 'voteup' ? upvote(payload) :
  //         downvote(payload)
  // )
}
