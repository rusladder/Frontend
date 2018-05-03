import React from 'react';
import Icon from 'app/components/elements/Icon';
import tt from 'counterpart';

const widget = ({vertical}) => (
  !vertical ? <li className=''>
      <a href="https://t.me/golos_support" title="blaaaaaaaaaaa">
        <Icon name="flag" />
      </a>
    </li>
    : null
)
;

export default widget;
