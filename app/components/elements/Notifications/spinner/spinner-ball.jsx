import React from 'react';
//
export default ({color = '#e1e1e1', size} = {}) =>
    <div style={{color}} className={`la-ball-clip-rotate-multiple ${!size ? '' : size}`}>
        <div></div>
        <div></div>
    </div>
