import React, { PropTypes } from 'react';
import tt from 'counterpart';

const TYPES = {
    info: {
        title: 'dialog.info',
    },
    alert: {
        title: 'dialog.alert',
    },
    confirm: {
        title: 'dialog.confirm',
    },
    prompt: {
        title: 'dialog.prompt',
    },
};

export default class Dialog extends React.PureComponent {
    static propTypes = {
        type: PropTypes.oneOf(['info', 'alert', 'confirm', 'prompt']),
        onClose: PropTypes.func.isRequired,
    };

    render() {
        const { text, title, type } = this.props;

        const options = TYPES[type];

        return (
            <form
                className={`Dialog Dialog_${type || 'info'}`}
                onSubmit={this._onSubmit}
            >
                <div className="Dialog__header">
                    {title || tt(options.title)}
                </div>
                <div className="Dialog__wrapper">
                    <div className="Dialog__content">
                        {text}
                        {type === 'prompt' ? (
                            <input className="Dialog__prompt-input" ref="input" autoFocus />
                        ) : null}
                    </div>
                    {type === 'prompt' ? (
                        <div className="Dialog__footer">
                            <button>{tt('g.ok')}</button>
                            <button
                                type="button"
                                onClick={() => this.props.onClose()}
                            >
                                {tt('g.cancel')}
                            </button>
                        </div>
                    ) : type === 'confirm' ? (
                        <div className="Dialog__footer">
                            <button autoFocus>{tt('g.ok')}</button>
                            <button
                                type="button"
                                onClick={() => this.props.onClose()}
                            >
                                {tt('g.cancel')}
                            </button>
                        </div>
                    ) : (
                        <div className="Dialog__footer">
                            <button autoFocus>{tt('g.ok')}</button>
                        </div>
                    )}
                </div>
            </form>
        );
    }

    _onSubmit = e => {
        e.preventDefault();
        e.stopPropagation();

        const { type, onClose } = this.props;

        if (type === 'prompt') {
            onClose(this.refs.input.value);
        } else if (type === 'confirm') {
            onClose(true);
        } else {
            onClose();
        }
    };
}
