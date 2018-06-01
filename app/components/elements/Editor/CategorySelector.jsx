import React from 'react';
import { connect } from 'react-redux';
import tt from 'counterpart';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import { cleanReduxInput } from 'app/utils/ReduxForms';
import Icon from 'app/components/elements/Icon.jsx';

class CategorySelector extends React.Component {
    static propTypes = {
        // HTML props
        id: React.PropTypes.string, // DOM id for active component (focusing, etc...)
        autoComplete: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        onChange: React.PropTypes.func.isRequired,
        onBlur: React.PropTypes.func.isRequired,
        isEdit: React.PropTypes.bool,
        disabled: React.PropTypes.bool,
        value: React.PropTypes.string,
        tabIndex: React.PropTypes.number,

        // redux connect (overwrite in HTML)
        trending: React.PropTypes.object.isRequired, // Immutable.List
    };

    static defaultProps = {
        autoComplete: 'on',
        id: 'CategorySelectorId',
        isEdit: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            createCategory: true,
            value: props.value,
            tagsList: [],
        };

        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'CategorySelector'
        );
    }

    render() {
        const { trending, tabIndex, disabled } = this.props;
        const categories = trending
            .slice(0, 11)
            .filterNot(c => validateCategory(c));
        const { createCategory } = this.state;

        const categoryOptions = categories.map((c, idx) => (
            <option value={c} key={idx}>
                {c}
            </option>
        ));

        let tagsListElement = [];

        this.state.tagsList.forEach((element, index) => {
            if (element)
                tagsListElement.push(
                    <span
                        className="GolosEditor__tag__label label"
                        key={'tag_element_' + index}
                    >
                        {element}
                        <a onClick={() => this.removeTag(element)}>
                            <Icon name="editor/ic-cross-gr-small" size="07x" />
                        </a>
                    </span>
                );
        });

        const categoryInput = (
            <div className="GolosEditor__categories__input__block row">
                <div className="input-group input-group-rounded column small-4">
                    <input
                        className="input-group-field"
                        value={this.state.value}
                        type="text"
                        ref="categoryRef"
                        onChange={this.handleChange}
                    />
                    <a>
                        <div className="input-group-button">
                            <Icon name="editor/ic-plus-normal" />
                        </div>
                    </a>
                </div>
                <div className="GolosEditor__tag__label__list column small-8">
                    {tagsListElement}
                </div>
            </div>
        );

        const categorySelect = (
            <select
                {...cleanReduxInput(this.props)}
                onChange={this.categorySelectOnChange}
                ref="categoryRef"
                tabIndex={tabIndex}
                disabled={disabled}
            >
                <option value="">
                    {tt('category_selector_jsx.select_a_tag')}...
                </option>
                {categoryOptions}
                <option value="new">{this.props.placeholder || tt('category_selector_jsx.tag_your_story')}</option>
            </select>
        );
        return <span>{createCategory ? categoryInput : categorySelect}</span>;
    }

    handleChange = e => {
        e.preventDefault();
        const _tagsArray = this.state.tagsList;
        let inputValue = e.target.value;

        if (/[,.; ]/g.test(inputValue)) {
            inputValue = inputValue.replace(/[,.; ]/g, ' ');
            inputValue.split(' ').forEach(element => {
                if (element && element.length > 0) {
                    _tagsArray.push(element);
                }
            });
            this.setState({ value: '' });
            this.setState({ tagsList: _tagsArray });
            this.props.onChange(_tagsArray.join(' '));
        } else {
            this.setState({ value: inputValue });
        }
    };

    categorySelectOnChange = e => {
        e.preventDefault();
        console.log('!!!categorySelectOnChange!!!');
        const { value } = e.target;
        const { onBlur } = this.props; // call onBlur to trigger validation immediately

        if (value === 'new') {
            this.setState({ createCategory: true });
            setTimeout(() => {
                if (onBlur) onBlur();
                this.refs.categoryRef.focus();
            }, 300);
        } else this.props.onChange(e);
    };

    removeTag = el => {
        const _tagsArray = this.state.tagsList;
        const elementIndex = this.state.tagsList.indexOf(el);
        _tagsArray.splice(elementIndex, 1);
        this.setState({ tagsList: _tagsArray });
        this.props.onChange(_tagsArray.join(' '));
    };
}

export function validateCategory(category, required = true) {
    if (!category || category.trim() === '') {
        return required ? tt('g.required') : null;
    }
    const cats = category.trim().split(/\s+/);

    if (cats.length > 5) {
        return tt('category_selector_jsx.use_limitied_amount_of_categories', {
            amount: 5,
        });
    }

    let error = null;

    if (cats.find(c => c.length > 24)) {
        error = 'category_selector_jsx.maximum_tag_length_is_24_characters';
    } else if (cats.find(c => c.split('-').length > 2)) {
        error = 'category_selector_jsx.use_one_dash';
    } else if (cats.find(c => c.indexOf(',') >= 0)) {
        error = 'category_selector_jsx.use_spaces_to_separate_tags';
    } else if (cats.find(c => /[A-ZА-ЯЁҐЄІЇ]/.test(c))) {
        error = 'category_selector_jsx.use_only_lowercase_letters';
    } else if (cats.find(c => c !== '18+' && !/^[a-zа-яё0-9-ґєії]+$/.test(c))) {
        error = 'category_selector_jsx.use_only_allowed_characters';
    } else if (cats.find(c => c !== '18+' && !/^[a-zа-яё-ґєії]/.test(c))) {
        error = 'category_selector_jsx.must_start_with_a_letter';
    } else if (cats.find(c => c !== '18+' && !/[a-zа-яё0-9ґєії]$/.test(c))) {
        error = 'category_selector_jsx.must_end_with_a_letter_or_number';
    }

    if (error) {
        return tt(error);
    }
}

export default connect((state, ownProps) => {
    const trending = state.global.getIn(['tag_idx', 'trending']);
    return { trending, ...ownProps };
})(CategorySelector);
