import React from 'react';
import tt from 'counterpart';
import SimpleMDE from 'simplemde';
import markdown from './Plugins/extraMarkdown';

export default class MarkdownEditor extends React.Component {
    static propTypes = {
        value: React.PropTypes.string,
        onChange: React.PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            keyChange: false,
        };

        this.createEditor = this.createEditor.bind(this);
        this.eventWrapper = this.eventWrapper.bind(this);
        this.removeEvents = this.removeEvents.bind(this);
        this.addEvents = this.addEvents.bind(this);
        this.onDropEvent = this.onDropEvent.bind(this);
    }

    componentDidMount() {
        this.createEditor();
        this.addEvents();
    }

    componentWillReceiveProps(nextProps) {
        if (
            !this.state.keyChange &&
            nextProps.value !== this.simplemde.value()
        ) {
            this.simplemde.value(nextProps.value);
        }

        this.setState({
            keyChange: false,
        });
    }

    componentWillUnmount() {
        this.removeEvents();
    }

    createEditor() {
        this.simplemde = new SimpleMDE({
            ...this.getMarkdownOptions(),
            element: document.getElementById('markdown-textarea'),
        });
    }

    eventWrapper(e) {
        this.setState({ keyChange: true });

        if (e.key === 'Enter') {
            let pos = this.simplemde.codemirror.getCursor();
            this.simplemde.codemirror.setSelection(pos, pos);
            this.simplemde.codemirror.replaceSelection('\n');
        }
        this.props.onChange(this.simplemde.value());
    }

    removeEvents() {
        this.editorEl.removeEventListener('keyup', this.eventWrapper);
        this.editorToolbarEl &&
            this.editorToolbarEl.removeEventListener(
                'click',
                this.eventWrapper
            );
        this.editorEl.removeEventListener('drop', this.onDropEvent);
    }

    addEvents() {
        const wrapperId = `markdown-editor-wrapper`;
        const wrapperEl = document.getElementById(`${wrapperId}`);
        this.editorEl = wrapperEl.getElementsByClassName('CodeMirror')[0];
        this.editorToolbarEl = wrapperEl.getElementsByClassName(
            'editor-toolbar'
        )[0];

        this.editorEl.addEventListener('keyup', this.eventWrapper);
        this.editorToolbarEl &&
            this.editorToolbarEl.addEventListener('click', this.eventWrapper);
        this.editorEl.addEventListener('drop', this.onDropEvent);
    }

    getMarkdownOptions() {
        function extraRender(text) {
            return markdown(text);
        }

        return {
            autofocus: false,
            toolbar: [
                'heading',
                'bold',
                'italic',
                '|',
                'code',
                'quote',
                'unordered-list',
                'ordered-list',
                '|',
                'link',
                'image',
                {
                    name: 'media',
                    action: function customFunction(editor) {
                        function insertMedia(url) {
                            const isYoutube = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
                            const isVimeo = /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/;
                            if (isYoutube.test(url))
                                return ['@[youtube](', '#url#)'];
                            else if (isVimeo.test(url))
                                return ['@[vimeo](', '#url#)'];
                            else return ['![](', '#url#)'];
                        }

                        function _replaceSelection(cm, active, startEnd, url) {
                            if (
                                /editor-preview-active/.test(
                                    cm.getWrapperElement().lastChild.className
                                )
                            )
                                return;

                            var text;
                            var start = startEnd[0];
                            var end = startEnd[1];
                            var startPoint = cm.getCursor('start');
                            var endPoint = cm.getCursor('end');
                            if (url) {
                                end = end.replace('#url#', url);
                            }
                            if (active) {
                                text = cm.getLine(startPoint.line);
                                start = text.slice(0, startPoint.ch);
                                end = text.slice(startPoint.ch);
                                cm.replaceRange(start + end, {
                                    line: startPoint.line,
                                    ch: 0,
                                });
                            } else {
                                text = cm.getSelection();
                                cm.replaceSelection(start + text + end);

                                startPoint.ch += start.length;
                                if (startPoint !== endPoint) {
                                    endPoint.ch += start.length;
                                }
                            }
                            cm.setSelection(startPoint, endPoint);
                            cm.focus();
                        }

                        const cm = editor.codemirror;
                        const options = editor.options;
                        let stat = editor.getState(cm);
                        var url = 'http://';
                        if (options.promptURLs) {
                            url = prompt(options.promptTexts.link);
                            if (!url) {
                                return false;
                            }
                        }

                        _replaceSelection(cm, stat.link, insertMedia(url), url);
                    },
                    className: 'fa fa-play-circle',
                    title: 'Добавить мультимедиа (youtube/vimeo)',
                    default: true,
                },
                '|',
                'preview',
                {
                    name: 'guide',
                    action:
                        'https://golos.io/ru--golos/@on0tole/osnovy-oformleniya-postov-na-golose-polnyi-kurs-po-rabote-s-markdown',
                    className: 'fa fa-question-circle',
                    title: 'Руководство по Markdown',
                    default: true,
                },
            ],
            spellChecker: false,
            status: false,
            blockStyles: {
                italic: '_',
            },
            dragDrop: true,
            promptURLs: true,
            value: this.props.value,
            onChange: this.props.onChange,
            initialValue: this.props.value,
            placeholder: tt('g.write_your_story'),
            autoDownloadFontAwesome: false,
            parsingConfig: {
                allowAtxHeaderWithoutSpace: false,
                strikethrough: true,
                underscoresBreakWords: false,
            },
            previewRender: extraRender,
        };
    }

    onDropEvent = event => {
        let coords = this.simplemde.codemirror.coordsChar({
            left: event.pageX,
            top: event.pageY,
        });
        this.setState({ dropCoords: coords });
    };

    render() {
        let { dropCoords } = this.state;

        insertImage = imageUrl => {
            if (dropCoords) {
                this.simplemde.codemirror.replaceRange(imageUrl, dropCoords);
                this.setState({ dropCoords: false });
            } else {
                let pos = this.simplemde.codemirror.getCursor();
                this.simplemde.codemirror.setSelection(pos, pos);
                this.simplemde.codemirror.replaceSelection(imageUrl);
            }
        };

        return (
            <div id="markdown-editor-wrapper">
                <textarea id="markdown-textarea" />
            </div>
        );
    }
}

let insertImage = () => {};
export { insertImage };
