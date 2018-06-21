import React from 'react';
import cn from 'classnames';
import tt from 'counterpart';
import Dropzone from 'react-dropzone';
import KEYS from 'app/utils/keyCodes';
import Icon from 'app/components/elements/Icon';
import DialogManager from 'app/components/elements/common/DialogManager';

const GUIDE_URL =
    'https://golos.io/ru--golos/@on0tole/osnovy-oformleniya-postov-na-golose-polnyi-kurs-po-rabote-s-markdown';

const MAX_HEADING = 4;
const TOOLBAR_OFFSET = 7;
const TOOLBAR_WIDTH = 412;
const MIN_TIP_OFFSET = 29;

const PLUS_ACTIONS = [
    {
        id: 'link',
        icon: 'link',
        tooltip: 'editor_toolbar.add_link',
        placeholder: 'editor_toolbar.enter_link',
    },
    {
        id: 'video',
        icon: 'video',
        tooltip: 'editor_toolbar.add_video',
        placeholder: 'editor_toolbar.enter_video_link',
    },
];

export default class MarkdownEditorToolbar extends React.PureComponent {
    constructor(props) {
        super(props);

        this._editor = props.editor;
        this._cm = this._editor.codemirror;

        this.state = {
            state: props.editor.getState(),
            toolbarShow: false,
            newLineOpen: false,
            selected: null,
        };
    }

    componentDidMount() {
        this._editor.codemirror.on('cursorActivity', this._onCursorActivity);
        document.addEventListener('keydown', this._onGlobalKeyDown);
    }

    componentWillUnmount() {
        this._editor.codemirror.off('cursorActivity', this._onCursorActivity);
        document.removeEventListener('keydown', this._onGlobalKeyDown);
    }

    render() {
        const { newLineHelper } = this.state;

        return (
            <div className="MET" ref="root">
                {this._renderToolbar()}
                {newLineHelper ? this._renderHelper(newLineHelper) : null}
            </div>
        );
    }

    _renderToolbar() {
        const { SM } = this.props;
        const { state, toolbarPosition, toolbarShow } = this.state;
        const { root } = this.refs;

        const editor = this._editor;

        let style = {
            width: TOOLBAR_WIDTH,
        };

        let toolbarTipLeft = null;

        if (toolbarPosition) {
            const rootPos = root.getBoundingClientRect();

            style.top =
                toolbarPosition.top -
                rootPos.top -
                window.scrollY -
                TOOLBAR_OFFSET;

            if (toolbarPosition.left != null) {
                let left = Math.round(toolbarPosition.left - rootPos.left);
                toolbarTipLeft = TOOLBAR_WIDTH / 2;

                const deltaLeft = left - TOOLBAR_WIDTH / 2;

                if (deltaLeft < 0) {
                    toolbarTipLeft = Math.max(MIN_TIP_OFFSET, left);
                    left = TOOLBAR_WIDTH / 2;
                } else {
                    const deltaRight = left + TOOLBAR_WIDTH / 2 - rootPos.width;

                    if (deltaRight > 0) {
                        toolbarTipLeft = Math.min(
                            TOOLBAR_WIDTH - MIN_TIP_OFFSET,
                            TOOLBAR_WIDTH / 2 + deltaRight
                        );
                        left = rootPos.width - TOOLBAR_WIDTH / 2;
                    }
                }

                style.left = Math.round(left);
            }
        }

        return (
            <div
                className={cn('MET__toolbar', {
                    MET__toolbar_raising: toolbarShow,
                })}
                style={style}
            >
                {toolbarTipLeft != null ? (
                    <div
                        className="MET__toolbar-tip"
                        style={{
                            left: toolbarTipLeft,
                        }}
                    />
                ) : null}
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
                    onClick={this._onHeadingClick}
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
                <a href={GUIDE_URL} target="_blank">
                    <Icon
                        className="MET__icon"
                        name="editor-toolbar/search"
                        data-tooltip={tt('editor_toolbar.markdown_help')}
                    />
                </a>
            </div>
        );
    }

    _renderHelper(pos) {
        const { newLineOpen, selected } = this.state;
        const { root } = this.refs;

        const action = selected
            ? PLUS_ACTIONS.find(a => a.id === selected)
            : null;

        return (
            <div
                className={cn('MET__new-line-helper', {
                    'MET__new-line-helper_open': newLineOpen,
                    'MET__new-line-helper_selected': newLineOpen && selected,
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
            state: this._editor.getState(),
        });

        const cm = this._cm;

        const cursor = cm.getCursor();
        const selection = cm.getSelection();
        const currentLine = cm.getLine(cursor.line);

        if (currentLine.trim() === '') {
            const pos = cm.cursorCoords();

            this.setState({
                newLineHelper: {
                    top: Math.ceil(pos.top + (pos.bottom - pos.top) / 2),
                },
                toolbarShow: false,
                newLineOpen: false,
                selected: null,
            });
        } else if (selection) {
            const pos = cm.cursorCoords();

            const toolbarPosition = {
                top: Math.round(pos.top),
            };

            const selectionNode = document.querySelector(
                '.CodeMirror-selectedtext'
            );

            if (selectionNode) {
                const bound = selectionNode.getBoundingClientRect();

                toolbarPosition.left = Math.round(bound.left + bound.width / 2);
            }

            this.setState({
                toolbarShow: true,
                toolbarPosition,
            });
        } else {
            this.setState({
                toolbarShow: false,
                newLineHelper: null,
            });
        }
    };

    _onPlusClick = () => {
        if (this.state.newLineOpen) {
            this.setState({
                newLineOpen: false,
            });
        } else {
            this.setState({
                newLineOpen: true,
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
        if (e.which === KEYS.ENTER) {
            const value = e.target.value;
            e.target.value = '';

            this._makeNewLineAction(value);

            this.setState({
                newLineOpen: false,
                selected: null,
            });
        }
    };

    _makeNewLineAction(text) {
        const { selected } = this.state;
        const cm = this._cm;

        if (selected === 'link') {
            const selection = cm.getSelection() || text;
            const cursor = cm.getCursor();

            cm.replaceSelection(`[${selection}](${text})`);

            cm.setSelection(
                {
                    ch: cursor.ch + 1,
                    line: cursor.line,
                },
                {
                    ch: cursor.ch + selection.length + 1,
                    line: cursor.line,
                }
            );

            setTimeout(() => {
                cm.focus();
            });
        } else if (selected === 'video') {
            cm.replaceSelection(this._processVideoUrl(text));
            cm.focus();
        } else {
            console.error('INVALID_CASE');
        }
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
            newLineOpen: false,
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
        const cm = this._cm;

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
        const url = await DialogManager.prompt(
            tt('editor_toolbar.enter_the_link') + ':'
        );

        if (url) {
            this._cm.replaceSelection(this._processVideoUrl(url));
            this._cm.focus();
        }
    };

    _processVideoUrl(url) {
        // Parse https://vimeo.com/channels/staffpicks/273652603
        const match = url.match(
            /^(?:https?:\/\/)?vimeo\.com\/[a-z0-9]+\/[a-z0-9]+\/(\d+.*)$/
        );

        if (match) {
            return `https://vimeo.com/${match[1]}`;
        }

        return url;
    }

    _onHeadingClick = () => {
        const cm = this._cm;

        const cursor = cm.getCursor();
        const text = cm.getLine(cursor.line);

        const match = text.match(/^(#+)(\s*)/);

        if (match) {
            const count = match[1].length;

            if (count >= MAX_HEADING) {
                cm.setSelection(
                    {
                        ch: 0,
                        line: cursor.line,
                    },
                    {
                        ch: count + match[2].length,
                        line: cursor.line,
                    }
                );

                cm.replaceSelection('');
                cm.setCursor({
                    ch: 0,
                    line: cursor.line,
                });
            } else {
                cm.setCursor({
                    ch: 0,
                    line: cursor.line,
                });
                cm.replaceSelection('#');

                cm.setCursor({
                    ch: 1 + count + match[2].length,
                    line: cursor.line,
                });
            }
        } else {
            cm.setCursor({
                ch: 0,
                line: cursor.line,
            });
            cm.replaceSelection('# ');
        }

        cm.focus();
    };

    _onGlobalKeyDown = e => {
        if (this.state.toolbarShow && e.which === KEYS.ESCAPE) {
            this.setState({
                toolbarShow: false,
            });
        }
    };
}