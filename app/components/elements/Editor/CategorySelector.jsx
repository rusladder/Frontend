import React from 'react';
import cn from 'classnames';
import Icon from 'app/components/elements/Icon.jsx';

const splitTagsRx = /[,.;\s]/;

export default class CategorySelector extends React.PureComponent {
    static propTypes = {
        id: React.PropTypes.string,
        value: React.PropTypes.string,
        tabIndex: React.PropTypes.number,
        onBlur: React.PropTypes.func,
        onChange: React.PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            tagsList: props.value !== '' ? props.value.split(/\s+/) : [],
            favoriteTags: [],
        };
    }

    componentDidMount() {
        window.addEventListener('mouseup', this._onGlobalMouseUp);

        try {
            const tagsJson = localStorage['golos.tags'];
            let tags = [];

            if (tagsJson) {
                const allTags = JSON.parse(tagsJson);
                tags = allTags.slice(0, 5).map(tagInfo => tagInfo[0]);
            }

            this.setState({
                favoriteTags: tags,
            });
        } catch (err) {
            console.error(err);
        }
    }

    componentWillUnmount() {
        this._unmount = true;

        window.removeEventListener('mouseup', this._onGlobalMouseUp);
        window.removeEventListener('mousemove', this._onGlobalMouseMove);

        this._toggleDraggingMode(false);
    }

    render() {
        const { id, tabIndex } = this.props;

        return (
            <div
                className={cn(
                    'CategorySelector CategorySelector_with-input',
                    {
                        CategorySelector_drag: this._isDragging,
                    }
                )}
            >
                <div
                    className="CategorySelector__input-wrapper"
                >
                    <input
                        id={id}
                        className="CategorySelector__input"
                        value={this.state.value}
                        type="text"
                        ref="categoryRef"
                        tabIndex={tabIndex}
                        placeholder={'Добавьте теги (до 5 шт.)'} // FIXME tt()
                        onChange={this._onInputChange}
                        onKeyDown={this._onInputKeyDown}
                    />
                    <i
                        className="CategorySelector__input-plus"
                        onClick={this._onPlusClick}
                        title="Добавить" // FIXME tt()
                    >
                        <Icon name="editor/ic-plus-normal" />
                    </i>
                </div>
                <div className="CategorySelector__tags-panel">
                    {this._renderTagList()}
                    {this._renderPopularList()}
                </div>
            </div>
        );
    }

    _renderTagList() {
        const { tagsList } = this.state;

        return (
            <div className="CategorySelector__tag-list">
                {tagsList.length === 0 ? (
                    <span className="CategorySelector__tag-list-empty">
                        Список пуст...
                    </span>
                ) : null}
                {tagsList.map(tag => (
                    <span
                        key={tag}
                        className={cn('CategorySelector__tag', {
                            CategorySelector__tag_drag:
                                this._draggingTag === tag,
                        })}
                        data-tag={tag}
                        ref={this._draggingTag === tag ? 'drag-item' : null}
                        onMouseDown={this._onMouseDown}
                        onMouseMove={
                            this._isDragging && this._draggingTag !== tag
                                ? this._onTagMouseMove
                                : null
                        }
                    >
                        {tag}
                        <i
                            className="CategorySelector__tag-icon"
                            onClick={() => this._removeTag(tag)}
                        >
                            <Icon name="editor/ic-cross-gr-small" size="07x" />
                        </i>
                    </span>
                ))}
            </div>
        );
    }

    _renderPopularList() {
        const { tagsList, favoriteTags } = this.state;

        return (
            <div className="CategorySelector__tag-list CategorySelector__tag-list_popular">
                {favoriteTags
                    .filter(tag => !tagsList.includes(tag))
                    .map(tag => (
                        <span
                            key={tag}
                            className="CategorySelector__tag CategorySelector__tag_favorite"
                            onClick={() => this._addTag(tag)}
                        >
                            {tag}
                            <i className="CategorySelector__tag-icon">
                                <Icon name="editor/ic-plus-normal" size="07x" />
                            </i>
                        </span>
                    ))}
            </div>
        );
    }

    _onInputChange = e => {
        const value = e.target.value;

        if (splitTagsRx.test(value)) {
            this._addTags(value.split(splitTagsRx));
        } else {
            this.setState({ value });
        }
    };

    _addTags(tags) {
        const { tagsList } = this.state;

        for (let tag of tags) {
            if (tag && !tagsList.includes(tag)) {
                tagsList.push(tag);
            }
        }

        this.setState({
            value: '',
        });

        this._tagsChanged();
    }

    _tagsChanged(tagsList = this.state.tagsList) {
        const tagLine = tagsList.join(' ');
        this.props.onChange(tagLine);
        setTimeout(() => {
            if (!this._unmount) {
                this.props.onChange(tagLine);
            }
        });
    }

    _removeTag = el => {
        const { tagsList } = this.state;
        const elementIndex = tagsList.indexOf(el);

        if (elementIndex !== -1) {
            tagsList.splice(elementIndex, 1);
            this.forceUpdate();
            this._tagsChanged();
        }
    };

    _addTag = tag => {
        const { tagsList } = this.state;

        if (!tagsList.includes(tag)) {
            tagsList.push(tag);
            this.forceUpdate();
            this._tagsChanged();
        }
    };

    _onMouseDown = e => {
        e.preventDefault();

        this._toggleDraggingMode(false);

        this._mouseDownPosition = {
            x: e.clientX,
            y: e.clientY,
            tag: e.currentTarget.getAttribute('data-tag'),
        };

        window.addEventListener('mousemove', this._onGlobalMouseMove);
    };

    _onGlobalMouseUp = () => {
        this._toggleDraggingMode(false);
    };

    _onGlobalMouseMove = e => {
        if (this._isDragging) {
            return;
        }

        const pos = this._mouseDownPosition;

        if (Math.abs(pos.x - e.clientX) + Math.abs(pos.y - e.clientY) > 5) {
            this._mouseDownPosition = null;
            this._toggleDraggingMode(true);
            this._draggingTag = pos.tag;

            window.removeEventListener('mousemove', this._onGlobalMouseMove);

            this.forceUpdate();
        }
    };

    _toggleDraggingMode(enable) {
        window.removeEventListener('mousemove', this._onGlobalMouseMove);

        if (this._isDragging === enable) {
            return;
        }

        if (enable) {
        } else {
            window.removeEventListener('mousemove', this._onGlobalMouseMove);
            this._draggingTag = null;
        }

        this._isDragging = enable;

        if (!this._unmount) {
            this.forceUpdate();
        }
    }

    _onInputKeyDown = e => {
        if (e.which === 13) {
            e.preventDefault();

            const value = this.refs.categoryRef.value;
            this._addTags(value.split(splitTagsRx));
        }
    };

    _onPlusClick = () => {
        const value = this.refs.categoryRef.value;
        this._addTags(value.split(splitTagsRx));
    };

    _onTagMouseMove = e => {
        if (!this._isDragging) {
            return;
        }

        const target = e.currentTarget;

        const tag = target.dataset['tag'];

        const box = target.getBoundingClientRect();
        const draggingBox = this.refs['drag-item'].getBoundingClientRect();

        const modifier = box.x > draggingBox.x ? 0.2 : 0.8;
        const positionShift = e.clientX > box.x + box.width * modifier ? 1 : 0;

        const tagsList = this.state.tagsList.filter(
            tag => tag !== this._draggingTag
        );

        const tagIndex = tagsList.indexOf(tag);

        tagsList.splice(tagIndex + positionShift, 0, this._draggingTag);

        this.setState({
            tagsList,
        });

        this._tagsChanged(tagsList);
    };
}
