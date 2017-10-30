import React from 'react';
import AddToWaitingList from 'app/components/modules/AddToWaitingList';
import tt from 'counterpart';

class WaitingList extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="column large-4 medium-6 small-12">
                    <AddToWaitingList />
                </div>
            </div>
        );
    }
}

module.exports = {
    path: 'waiting_list.html',
    component: WaitingList
};
