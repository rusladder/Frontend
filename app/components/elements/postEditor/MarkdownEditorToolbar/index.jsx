import React from 'react';
import cn from 'classnames';
import Dropzone from 'react-dropzone';
import Icon from 'app/components/elements/Icon';
import DialogManager from 'app/components/elements/common/DialogManager';
import tt from 'counterpart';

const GUIDE_URL =
    'https://golos.io/ru--golos/@on0tole/osnovy-oformleniya-postov-na-golose-polnyi-kurs-po-rabote-s-markdown';

const PLUS_ACTIONS = [
    {
        id: 'video',
        icon: 'video',
        tooltip: 'editor_toolbar.add_video',
        placeholder: 'editor_toolbar.enter_video_link',
    },
    {
        id: 'link',
        icon: 'link',
        tooltip: 'editor_toolbar.add_link',
        placeholder: 'editor_toolbar.enter_link',
    },
];

export default class MarkdownEditorToolbar extends React.PureComponent {
    constructor(props) {
        super(props);

        this.editor = props.editor;
        this.cm = this.editor.codemirror;

        this.state = {
            state: props.editor.getState(),
            open: false,
        };
    }

    componentDidMount() {
        this.editor.codemirror.on('cursorActivity', this._onCursorActivity);
    }

    componentWillUnmount() {
        this.editor.codemirror.off('cursorActivity', this._onCursorActivity);
    }

    render() {
        const { SM } = this.props;
        const { state, newLineHelper } = this.state;
        const editor = this.editor;

        return (
            <div className="MET" ref="root">
                <div className="MET__toolbar">
                    <Icon
                        className={cn('MET__icon', {
                            MET__icon_active: state.bold,
                        })}
                        name="editor-toolbar/bold"
                        onClick={() => SM.toggleBold(editor)}
                    />
                    <Icon
                        className={cn('MET__icon', {
                            MET__icon_active: state.italic,
                        })}
                        name="editor-toolbar/italic"
                        onClick={() => SM.toggleItalic(editor)}
                    />
                    <Icon
                        className={cn('MET__icon', {
                            MET__icon_active: state.heading,
                        })}
                        name="editor-toolbar/header"
                        onClick={() => SM.toggleHeadingBigger(editor)}
                    />
                    <Icon
                        className={cn('MET__icon MET__icon_small', {
                            MET__icon_active: state.heading,
                        })}
                        name="editor-toolbar/header"
                        onClick={() => SM.toggleHeadingSmaller(editor)}
                    />
                    <Icon
                        className={cn('MET__icon', {
                            MET__icon_active: state.strikethrough,
                        })}
                        name="editor-toolbar/strike"
                        onClick={() => SM.toggleStrikethrough(editor)}
                    />
                    <i className="MET__separator" />
                    <Icon
                        className={cn('MET__icon', {
                            MET__icon_active: state['unordered-list'],
                        })}
                        name="editor-toolbar/bullet-list"
                        onClick={() => SM.toggleUnorderedList(editor)}
                    />
                    <Icon
                        className={cn('MET__icon', {
                            MET__icon_active: state['ordered-list'],
                        })}
                        name="editor-toolbar/number-list"
                        onClick={() => SM.toggleOrderedList(editor)}
                    />
                    <i className="MET__separator" />
                    <Icon
                        className={cn('MET__icon', {
                            MET__icon_active: state.quote,
                        })}
                        name="editor-toolbar/quote"
                        onClick={() => SM.toggleBlockquote(editor)}
                    />
                    <Icon
                        className={cn('MET__icon', {
                            MET__icon_active: state.link,
                        })}
                        name="editor-toolbar/link"
                        onClick={() => this._draw()}
                    />
                    <Icon
                        className="MET__icon"
                        name="editor-toolbar/picture"
                        data-tooltip={tt('editor_toolbar.add_image_link')}
                        onClick={() => this._draw(true)}
                    />
                    <Icon
                        className="MET__icon"
                        name="editor-toolbar/video"
                        data-tooltip={tt('editor_toolbar.add_video')}
                        onClick={this._drawVideo}
                    />
                    <i className="MET__separator" />
                    <a href={GUIDE_URL}>
                        <Icon
                            className="MET__icon"
                            name="editor-toolbar/search"
                            data-tooltip={tt('editor_toolbar.markdown_help')}
                        />
                    </a>
                </div>
                {newLineHelper ? this._renderHelper(newLineHelper) : null}
            </div>
        );
    }

    _renderHelper(pos) {
        const { open, selected } = this.state;
        const { root } = this.refs;

        const action = selected
            ? PLUS_ACTIONS.find(a => a.id === selected)
            : null;

        return (
            <div
                className={cn('MET__new-line-helper', {
                    'MET__new-line-helper_open': open,
                    'MET__new-line-helper_selected': open && selected,
                })}
                style={{
                    top:
                        pos.top -
                        root.getBoundingClientRect().top -
                        window.scrollY,
                }}
            >
                <div className="MET__plus-wrapper" onClick={this._onPlusClick}>
                    <Icon
                        className="MET__plus"
                        name="editor-toolbar/plus"
                        size="1_25x"
                    />
                </div>
                <div
                    className={cn('MET__new-line-actions', {
                        'MET__new-line-actions_selected': selected,
                    })}
                >
                    <Dropzone
                        className="MET__new-line-item"
                        multiple={false}
                        accept="image/*"
                        onDrop={this._onDrop}
                    >
                        <Icon
                            className="MET__new-line-icon"
                            name="editor-toolbar/picture"
                            data-tooltip="Добавить изображение с компьютера"
                        />
                    </Dropzone>
                    {PLUS_ACTIONS.map(action => (
                        <Icon
                            key={action.id}
                            className="MET__new-line-item MET__new-line-icon"
                            name={`editor-toolbar/${action.icon}`}
                            data-tooltip={tt(action.tooltip)}
                            onClick={() => this._onActionClick(action.id)}
                        />
                    ))}
                </div>
                {action ? (
                    <div
                        className="MET__new-line-input-wrapper"
                        key={action.id}
                    >
                        <Icon
                            className="MET__new-line-icon"
                            name={`editor-toolbar/${action.icon}`}
                            onClick={this._onResetActionClick}
                            data-tooltip={tt('g.cancel')}
                        />
                        <input
                            className="MET__new-line-input"
                            autoFocus
                            placeholder={tt(action.placeholder)}
                            onKeyDown={this._onInputKeyDown}
                        />
                    </div>
                ) : null}
            </div>
        );
    }

    _onCursorActivity = () => {
        this.setState({
            state: this.editor.getState(),
        });

        const cursor = this.cm.getCursor();
        const currentLine = this.cm.getLine(cursor.line);

        if (currentLine.trim() === '') {
            const pos = cm.cursorCoords();

            this.setState({
                newLineHelper: {
                    top: Math.ceil(pos.top + (pos.bottom - pos.top) / 2),
                },
                open: false,
            });
        } else {
            this.setState({
                newLineHelper: null,
            });
        }
    };

    _onPlusClick = () => {
        if (this.state.open) {
            this.setState({
                open: false,
            });
        } else {
            this.setState({
                open: true,
                selected: null,
            });
        }
    };

    _onActionClick = id => {
        this.setState({
            selected: id,
        });
    };

    _onResetActionClick = () => {
        this.setState({
            selected: null,
        });
    };

    _onInputKeyDown = e => {
        if (e.which === 13) {
            const value = e.target.value;
            e.target.value = '';

            this._makeNewLineAction(value);

            this.setState({
                open: false,
                selected: null,
            });
        }
    };

    _makeNewLineAction(text) {
        this.cm.replaceSelection(text);
        this.cm.focus();
    }

    _onDrop = (acceptedFiles, rejectedFiles) => {
        const file = acceptedFiles[0];

        if (!file) {
            if (rejectedFiles.length) {
                DialogManager.alert(
                    tt('reply_editor.please_insert_only_image_files')
                );
            }
            return;
        }

        this.setState({
            open: false,
            selected: null,
        });

        this.props.uploadImage(file, progress => {
            if (progress.url) {
                const imageUrl = `![${file.name}](${progress.url})`;

                this._cm.replaceSelection(imageUrl);
            }
        });
    };

    async _draw(isImage) {
        const cm = this.editor.codemirror;

        const url = await DialogManager.prompt(
            tt('editor_toolbar.enter_the_link') + ':'
        );

        if (url) {
            const startPoint = cm.getCursor('start');
            const selection = cm.getSelection();

            let offset;
            if (isImage) {
                cm.replaceSelection(`![${selection}](${url})`);
                offset = 2;
            } else {
                cm.replaceSelection(`[${selection}](${url})`);
                offset = 1;
            }

            cm.setSelection(
                {
                    ch: startPoint.ch + offset,
                    line: startPoint.line,
                },
                {
                    ch: startPoint.ch + offset + selection.length,
                    line: startPoint.line,
                }
            );
            cm.focus();
        }
    }

    _drawVideo = async () => {
        const cm = this.editor.codemirror;

        const url = await DialogManager.prompt(
            tt('editor_toolbar.enter_the_link') + ':'
        );

        if (url) {
            cm.replaceSelection(url);
            cm.focus();
        }
    };
}
