import React from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import reactForm from 'app/utils/ReactForm'
import transaction from 'app/redux/Transaction'

import CategorySelector from 'app/components/cards/CategorySelector'
import {validateCategory} from 'app/components/cards/CategorySelector'
import LoadingIndicator from 'app/components/elements/LoadingIndicator'
import Tooltip from 'app/components/elements/Tooltip'
import sanitizeConfig, {allowedTags} from 'app/utils/SanitizeConfig'
import sanitize from 'sanitize-html'
import HtmlReady from 'shared/HtmlReady'
import g from 'app/redux/GlobalReducer'
import {Set} from 'immutable'
import Remarkable from 'remarkable'
import Dropzone from 'react-dropzone'
import {LinkWithDropdown} from 'react-foundation-components/lib/global/dropdown'
import VerticalMenu from 'app/components/elements/VerticalMenu'
import tt from 'counterpart'
import {DEBT_TICKER, DEFAULT_DOMESTIC, DOMESTIC} from 'app/client_config'
import Icon from 'app/components/elements/Icon.jsx'
import {detransliterate, capitalizeFirstLetter} from 'app/utils/ParsersAndFormatters';

const remarkable = new Remarkable({html: true, linkify: false, breaks: true})

// load theme styles with webpack

import Feedback from './Feedback'

import MediumEditor from './MediumEditor'
import SimpleEditor from './Simple'

import toMarkdown from 'to-markdown'
import showdown from 'showdown'

const converter = new showdown.Converter();
converter.setOption('strikethrough', true);
converter.setOption('simpleLineBreaks', true);

class GolosEditor extends React.Component {

  static propTypes = {

    formId: React.PropTypes.string.isRequired, // unique form id for each editor
    type: React
      .PropTypes
      .oneOf(['submit_feedback', 'submit_story', 'submit_comment', 'edit']),
    successCallback: React.PropTypes.func, // indicator that the editor is done and can be hidden
    onCancel: React.PropTypes.func, // hide editor when cancel button clicked
    author: React.PropTypes.string, // empty or string for top-level post
    permlink: React.PropTypes.string, // new or existing category (default calculated from title)
    parent_author: React.PropTypes.string, // empty or string for top-level post
    parent_permlink: React.PropTypes.string, // new or existing category
    jsonMetadata: React.PropTypes.object, // An existing comment has its own meta data
    category: React.PropTypes.string, // initial value
    title: React.PropTypes.string, // initial value
    domestic: React.PropTypes.string, // initial value
    body: React.PropTypes.string, // initial value
  }

  constructor(props) {
    super()
    this.state = {
      progress: {},
      isVisualEditor: true
    }
    this.initForm(props)
  }

  componentWillMount() {
    const {setMetaData, formId, jsonMetadata} = this.props
    setMetaData(formId, jsonMetadata)

    if (process.env.BROWSER) {
      this.setAutoVote()
      this.setState({
        payoutType: this.props.isStory
          ? (localStorage.getItem('defaultPayoutType') || '50%')
          : '50%'
      })
    }
  }

  //OK
  componentDidMount() {
    setTimeout(() => {
      if (this.props.isStory) 
        this.refs.titleRef.focus()
      else if (this.refs.postRef) 
        this.refs.postRef.focus()
    }, 300)
  }

  componentWillUpdate(nextProps, nextState) {
    if (process.env.BROWSER) {
      const ts = this.state
      const ns = nextState

      // Save curent draft to localStorage if(ts.body.value !== ns.body.value ||
      // (ns.category && ts.category.value !== ns.category.value) ||     (ns.title &&
      // ts.title.value !== ns.title.value) ) { // also prevents saving after parent
      // deletes this information     const {formId} = nextProps     const {category,
      // title, body} = ns     const data = {         formId,         title: title ?
      // title.value : undefined,         category: category ? category.value :
      // undefined,         body: body.value,     } clearTimeout(saveEditorTimeout)
      // saveEditorTimeout = setTimeout(() => {      // console.log('save formId',
      // formId, body.value) localStorage.setItem('replyEditorData-' + formId,
      // JSON.stringify(data, null, 0))         this.showDraftSaved()     }, 500) }
    }
  }

  componentWillUnmount() {
    const {clearMetaData, formId} = this.props
    clearMetaData(formId)
  }

  initForm(props) {
    const {isStory, type, fields} = props
    const isEdit = type === 'edit'
    const isFeedback = type === 'submit_feedback'
    const maxKb = isStory
      ? 100
      : 16

    reactForm({
      fields,
      instance: this,
      name: 'replyForm',
      initialValues: props.initialValues,
      validation: values => ({
        title: isStory && (!values.title || values.title.trim() === ''
          ? tt('g.required')
          : values.title.length > 255
            ? tt('reply_editor.shorten_title')
            : null),
        category: isStory && !isFeedback && validateCategory(values.category, !isEdit),
        body: !values.body
          ? tt('g.required')
          : values.body.length > maxKb * 1024
            ? tt('reply_editor.exceeds_maximum_length', maxKb)
            : null
      })
    })
  }

  onTitleChange = e => {
    const value = e.target.value
    // TODO block links in title (they do not make good permlinks)
    const hasMarkdown = /(?:\*[\w\s]*\*|\#[\w\s]*\#|_[\w\s]*_|~[\w\s]*~|\]\s*\(|\]\s*\[)/.test(value)
    this.setState({
      titleWarn: hasMarkdown
        ? 'Markdown is not supported here'
        : ''
    })
    const {title} = this.state
    title
      .props
      .onChange(e)
  }

  onDomesticChange = e => {
    if (e) 
      e.preventDefault();
    const targetValue = e
      .target
      .text
      .trim();
    let value = DEFAULT_DOMESTIC;
    for (var key in DOMESTIC) {
      if (targetValue.localeCompare(DOMESTIC[key]) == 0) {
        value = key;
        break;
      }
    }
    this
      .state
      .domestic
      .props
      .onChange(value)
  }

  onCancel = e => {
    if (e) 
      e.preventDefault()
    const {onCancel} = this.props
    const {replyForm, body} = this.state
    if (!body.value || confirm(tt('reply_editor.are_you_sure_you_want_to_clear_this_form'))) {
      replyForm.resetForm()
      this.setAutoVote()
      this.setState({progress: {}})
      if (onCancel) 
        onCancel(e)
    }
  }

  //OK
  autoVoteOnChange = () => {
    const {autoVote} = this.state
    const key = 'EditorData-autoVote-story'
    localStorage.setItem(key, !autoVote.value)
    autoVote
      .props
      .onChange(!autoVote.value)
  }

  // onNsfwChange = e => {   let checked = e.target.checked   let {category} =
  // this.state;   let hits = [];   let reg = new RegExp('nsfw',"g","i");   hits =
  // category.value.match(reg);   if (!hits) {       alert("Your name wasn't
  // found!");   } else {       alert(hits);   } }

  onChange = (value) => {
    const {body, isVisualEditor} = this.state

    let convertDel = {
      filter: 'del',
      replacement: function (content) {
        return '~~' + content + '~~';
      }
    }
    let convertStrike = {
      filter: 'strike',
      replacement: function (content) {
        return '~~' + content + '~~';
      }
    }
    let convertDiv = {
      filter: 'div',
      replacement: function (content) {
        return '' + content + '';
      }
    }

    let res = toMarkdown(value, {
      converters: [convertDel, convertStrike]
    })

    if (isVisualEditor) {
      this.setState({
        body: {
          pureHTML: value,
          value: res
        }
      })

    } else {
      this.setState({
        body: {
          pureHTML: converter.makeHtml(value),
          value: value
        }
      })
    }
  }

  //OK
  setAutoVote() {
    const {isStory} = this.props
    if (isStory) {
      const {autoVote} = this.state
      const key = 'EditorData-autoVote-story'
      const autoVoteDefault = JSON.parse(localStorage.getItem(key) || true)
      autoVote
        .props
        .onChange(autoVoteDefault)
    }
  }

  //Ok
  toggleEditor = (e) => {
    e.preventDefault();
    const state = {
      isVisualEditor: !this.state.isVisualEditor
    }
    this.setState(state);
    localStorage.setItem('EditorData-isVisualEditor', this.state.isVisualEditor)
  }

  showDraftSaved() {
    const {draft} = this.refs
    draft.className = 'ReplyEditor__draft'
    void draft.offsetWidth; // reset animation
    draft.className = 'ReplyEditor__draft ReplyEditor__draft-saved'
  }

  onPayoutTypeChange = (e) => {
    const payoutType = e.currentTarget.value
    this.setState({payoutType})
    if (payoutType !== '0%') 
      localStorage.setItem('defaultPayoutType', payoutType)
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    if (!acceptedFiles.length) {
      if (rejectedFiles.length) {
        this.setState({
          progress: {
            error: tt('reply_editor.please_insert_only_image_files')
          }
        })
        console.log('onDrop Rejected files: ', rejectedFiles);
      }
      return
    }
    const file = acceptedFiles[0]
    this.upload(file, file.name)
  }

  onOpenClick = () => {
    this
      .dropzone
      .open();
  }

  onPasteCapture = e => {
    try {
      if (e.clipboardData) {
        for (const item of e.clipboardData.items) {
          if (item.kind === 'file' && /^image\//.test(item.type)) {
            const blob = item.getAsFile()
            this.upload(blob)
          }
        }
      } else {
        this.setState({noClipboardData: true})
      }
    } catch (error) {
      console.error('Error analyzing clipboard event', error);
    }
  }

  upload = (file, name = '') => {
    const {uploadImage} = this.props
    this.setState({
      progress: {
        message: tt('reply_editor.uploading') + '...'
      }
    })

    uploadImage(file, progress => {
      if (progress.url) {
        this.setState({progress: {}})
        const {url} = progress
        const image_md = `![${name}](${url})`
        const {body} = this.state
        const {selectionStart, selectionEnd} = this.refs.postRef
        body
          .props
          .onChange(body.value.substring(0, selectionStart) + image_md + body.value.substring(selectionEnd, body.value.length))
      } else {
        this.setState({progress})
      }
      setTimeout(() => {
        this.setState({progress: {}})
      }, 4000) // clear message
    })
  }

  render() {
    const originalPost = {
      category: this.props.category,
      body: this.props.body
    }

    const {onCancel, onTitleChange, autoVoteOnChange, onNsfwChange} = this

    const {
      title,
      domestic,
      category,
      body,
      autoVote,
      postError,
      titleWarn,
      isVisualEditor,
      payoutType,
      progress,
      noClipboardData
    } = this.state

    const {
      reply,
      username,
      isStory,
      formId,
      noImage,
      author,
      permlink,
      parent_author,
      parent_permlink,
      type,
      jsonMetadata,
      state,
      successCallback
    } = this.props

    const {submitting, valid, handleSubmit} = this.state.replyForm

    const disabled = submitting || !valid
    const loading = submitting || this.state.loading

    const errorCallback = estr => {
      this.setState({postError: estr, loading: false})
    }
    const successCallbackWrapper = (...args) => {
      this.setState({loading: false})
      if (successCallback) 
        successCallback(args)
    }
    const isEdit = type === 'edit'
    const isFeedback = type === 'submit_feedback'

    // Be careful, autoVote can reset curation rewards.  Never autoVote on edit..
    // const autoVoteValue = !isEdit && autoVote.value const replyParams = {
    // author, permlink, parent_author, parent_permlink, type, state, originalPost,
    // isHtml, isStory, isFeedback, jsonMetadata, autoVote: autoVoteValue,
    // payoutType,     successCallback: successCallbackWrapper, errorCallback }

    const replyParams = {
      author,
      permlink,
      parent_author,
      parent_permlink,
      type,
      state,
      originalPost,
      isStory,
      isFeedback,
      jsonMetadata,
      autoVote,
      payoutType,
      successCallback: successCallbackWrapper,
      errorCallback
    }

    const postLabel = username
      ? <Tooltip t={tt('g.post_as') + ' “' + username + '”'}>{tt('g.post')}</Tooltip>
      : tt('g.post')

    const hasTitleError = title && title.touched && title.error
    let titleError = null
    // The Required title error (triggered onBlur) can shift the form making it hard
    // to click on things..
    if ((hasTitleError && (title.error !== tt('g.required') || body.value !== '')) || titleWarn) {
      titleError = <div className={hasTitleError
        ? 'error'
        : 'warning'}>
        {hasTitleError
          ? title.error
          : titleWarn}&nbsp;
      </div>
    }

    DOMESTIC.all = tt('g.auto');
    let currentDomesticKey = DEFAULT_DOMESTIC;
    let currentDomesticTitle = DOMESTIC[currentDomesticKey];

    const domestic_menu = [];
    for (var key in DOMESTIC) {
      if (domestic && domestic.value === key) {
        currentDomesticKey = key;
        currentDomesticTitle = DOMESTIC[currentDomesticKey];
      } else 
        domestic_menu.push({
          link: '#' + key,
          onClick: this.onDomesticChange,
          value: DOMESTIC[key]
        })
    }

    return (
      <div className='GolosEditor row'>
        {isFeedback && <div className="column small-12"><Feedback/></div>}
        <form
          onSubmit={handleSubmit(({data}) => {
          const startLoadingIndicator = () => this.setState({loading: true, postError: undefined});
          reply({
            ...data,
            ...replyParams,
            startLoadingIndicator
          })
        })}
          onChange={() => {
          this.setState({postError: null})
        }}>

          {isStory && <div className='row'>
            <div className="column small-12">
              {< a href = "#" onClick = {
                this.toggleEditor
              } > {
                !isVisualEditor
                  ? `Визуальный ${tt('reply_editor.editor')}`
                  : `Markdown ${tt('reply_editor.editor')}`
              } </a>}
              <div className="GolosEditor__settings float-right secondary">
                <input type="hidden" {...domestic.props}/> {tt('settings_jsx.choose_domestic')}: &nbsp;
                <LinkWithDropdown
                  closeOnClickOutside
                  dropdownPosition="bottom"
                  dropdownAlignment="left"
                  dropdownContent=
                  { <VerticalMenu items = { domestic_menu } title = { tt('settings_jsx.choose_domestic') } /> }>
                  <a
                    className="ReplyEditor__domestic"
                    title={tt('settings_jsx.choose_domestic')}
                    onClick={e => e.preventDefault()}>
                    {currentDomesticTitle}
                    <Icon name="caret-down"/>
                  </a>
                </LinkWithDropdown>
              </div>
            </div>
          </div>}

          <div className='row'>
            <div className='column small-12'>
              <input
                {...title.props}
                type="text"
                onChange={onTitleChange}
                className='GolosEditor__title column small-12'
                placeholder={tt('reply_editor.placeholder')}
                autoComplete="off"
                ref="titleRef"/> {/* Title */}
              {titleError}
            </div>
          </div>

          <div className='GolosEditor__body row'>
            <div className='column small-12'>
              <span>
                <Dropzone
                  onDrop={this.onDrop}
                  className={type === 'submit_story'
                  ? 'dropzone'
                  : 'none'}
                  disableClick
                  multiple={false}
                  accept="image/*"
                  ref={(node) => {
                  this.dropzone = node;
                }}>
                  {isVisualEditor
                ? <MediumEditor body={body} onChange={this.onChange}/>
                : <SimpleEditor body={body} onChange={this.onChange}/>}
                </Dropzone>
                {type === 'submit_story' && <p className="drag-and-drop">
                  {tt('reply_editor.insert_images_by_dragging_dropping')}
                  <a onClick={this.onOpenClick}>{tt('reply_editor.selecting_them')}</a>
                  {noClipboardData
                    ? ''
                    : tt('reply_editor.pasting_from_the_clipboard')}
                </p>}
                {progress.message && <div className="info">{progress
                    .message
                    .replace('Uploading', tt('reply_editor.uploading'))}</div>}
                {progress.error && <div className="error">{tt('reply_editor.image_upload')}
                  : {progress.error}</div>}
              </span>
            </div>
            <div>
              {postError && <div className="error">{postError}</div>}
            </div>
          </div>

          {isStory && !isFeedback && <div className='row'>
            <div className='column small-12 GolosEditor__categories'>
              <CategorySelector {...category.props} disabled={loading} isEdit={isEdit}/>
              <div className="error">{(category.touched || category.value) && category.error}&nbsp;</div>
            </div>
          </div>}

          {isStory && !isFeedback && <div className='GolosEditor__settings row'>
            <div className='column small-8 large-12'>
              {/* <label className='float-left' title={tt('reply_editor.check_this_to_auto_upvote_your_post')}>
                Контент для взрослых&nbsp;
                <input type="checkbox" onChange={onNsfwChange}/>
              </label> */}
              <label title={tt('reply_editor.check_this_to_auto_upvote_your_post')}>
                {tt('g.upvote_post')}&nbsp;
                <input type="checkbox" checked={autoVote.value} onChange={autoVoteOnChange}/>
              </label>
            </div>
          </div>}

          <div className='GolosEditor__submit row'>
            <div className='column small-6 large-12'>
              {!loading && <button type="submit" className="button" disabled={disabled}>
                {isEdit
                  ? tt('reply_editor.update_post')
                  : postLabel}
              </button>}
              {loading && <span>
                <br/>
                <LoadingIndicator type="circle"/>
              </span>}
              {!loading && this.props.onCancel && <button
                type="button"
                className="secondary hollow button no-border"
                onClick={onCancel}>
                {tt('g.cancel')}
              </button>}
              {!loading && !this.props.onCancel && <button
                className="button hollow no-border"
                disabled={submitting}
                onClick={onCancel}>
                {tt('g.clear')}
              </button>}
            </div>
          </div>

          {isStory && !isEdit && <div className="ReplyEditor__options float-right text-right">

            {tt('g.rewards')}:&nbsp;
            <select
              value={this.state.payoutType}
              onChange={this.onPayoutTypeChange}
              style={{
              color: this.state.payoutType == '0%'
                ? 'orange'
                : 'inherit'
            }}>
              <option value="100%">{tt('reply_editor.power_up_100')}</option>
              <option value="50%">{tt('reply_editor.default_50_50')}</option>
              <option value="0%">{tt('reply_editor.decline_payout')}</option>
            </select>

            <br/>
          </div>}

        </form>
      </div>
    )
  }
}

export default formId => connect((state, ownProps) => {
  const username = state
    .user
    .getIn(['current', 'username'])
  const fields = ['body', 'autoVote:checked']
  const {type, jsonMetadata} = ownProps

  const isStory = /submit_story|submit_feedback/.test(type) || (isEdit && parent_author === '')
  const isFeedback = type === 'submit_feedback'
  const isEdit = type === 'edit'

  if (isStory) {
    fields.push('title')
    fields.push('category')
    fields.push('domestic')
  }

  let {category, title, body, domestic} = ownProps

  if (/submit_/.test(type)) 
    title = body = ''

  return {
    ...ownProps,
    username,
    fields,
    state,
    formId,
    isStory,
    isFeedback,
    isEdit,
    initialValues: {
      title,
      domestic,
      body,
      category
    }
  }
}, dispatch => ({
  clearMetaData: (id) => {
    dispatch(g.actions.clearMeta({id}))
  },
  setMetaData: (id, jsonMetadata) => {
    dispatch(g.actions.setMetaData({
      id,
      meta: jsonMetadata
        ? jsonMetadata.steem
        : null
    }))
  },
  uploadImage: (file, progress) => {
    dispatch({
      type: 'user/UPLOAD_IMAGE',
      payload: {
        file,
        progress
      }
    })
  },
  reply: ({
    category,
    title,
    domestic,
    body,
    author,
    permlink,
    parent_author,
    parent_permlink,
    isHtml,
    isStory,
    isFeedback,
    type,
    originalPost,
    autoVote = false,
    payoutType = '50%',
    state,
    jsonMetadata,
    successCallback,
    errorCallback,
    startLoadingIndicator
  }) => {
    // const post = state.global.getIn(['content', author + '/' + permlink])
    const username = state
      .user
      .getIn(['current', 'username'])

    // Parse categories: if category string starts with russian symbol, add 'ru-'
    // prefix to it when transletirate it This is needed to be able to
    // detransletirate it back to russian in future (to show russian categories to
    // user) (all of this is needed because blockchain does not allow russian
    // symbols in category)
    if (isFeedback) 
      category = 'обратная-связь'
    if (category) {
      category = category
        .split(' ')
        .map(item => /^[а-яё]/.test(item)
          ? 'ru--' + detransliterate(item, true)
          : item)
        .join(' ')
        .trim()
    }

    const isEdit = type === 'edit'
    const isNew = /^submit_/.test(type)

    // Wire up the current and parent props for either an Edit or a Submit (new
    // post) 'submit_story', 'submit_comment', 'edit'
    const linkProps = isNew
      ? { // submit new
        parent_author: author,
        parent_permlink: permlink,
        author: username,
        // permlink,  assigned in TransactionSaga
      }
      :
      // edit existing
      isEdit
        ? {
          author,
          permlink,
          parent_author,
          parent_permlink
        }
        : null

    if (!linkProps) 
      throw new Error('Unknown type: ' + type)

      // If this is an HTML post, it MUST begin and end with the tag
    if (isHtml && !body.match(/^<html>[\s\S]*<\/html>$/)) {
      errorCallback('HTML posts must begin with <html> and end with </html>')
      return
    }

    let rtags
    {
      const html = isHtml
        ? body
        : remarkable.render(body)
      rtags = HtmlReady(html, {mutate: false})
    }

    allowedTags.forEach(tag => {
      rtags
        .htmltags
        .delete(tag)
    })
    if (isHtml) 
      rtags.htmltags.delete('html') // html tag allowed only in HTML mode
    if (rtags.htmltags.size) {
      errorCallback('Please remove the following HTML elements from your post: ' + Array(...rtags.htmltags).map(tag => `<${tag}>`).join(', '))
      return
    }

    const formCategories = Set(category
      ? category.trim().replace(/#/g, "").split(/ +/)
      : [])
    const rootCategory = originalPost && originalPost.category
      ? originalPost.category
      : formCategories.first()
    let allCategories = Set([
      ...formCategories.toJS(),
      ...rtags.hashtags
    ])
    if (/^[-a-z\d]+$/.test(rootCategory)) 
      allCategories = allCategories.add(rootCategory)

      // merge
    const meta = isEdit
      ? jsonMetadata
      : {}
    if (allCategories.size) 
      meta.tags = allCategories.toJS();
    else 
      delete meta.tags
    if (rtags.usertags.size) 
      meta.users = rtags.usertags;
    else 
      delete meta.users
    if (rtags.images.size) 
      meta.image = rtags.images;
    else 
      delete meta.image
    if (rtags.links.size) 
      meta.links = rtags.links;
    else 
      delete meta.links
    if (domestic && Object.keys(DOMESTIC).indexOf(domestic) !== -1) 
      meta.language = domestic;
    else 
      delete meta.language

    meta.app = "golos.io/0.1"
    if (isStory) {
      meta.format = isHtml
        ? 'html'
        : 'markdown'
    }

    // if(Object.keys(json_metadata.steem).length === 0) json_metadata = {}// keep
    // json_metadata minimal
    const sanitizeErrors = []
    sanitize(body, sanitizeConfig({sanitizeErrors}))
    if (sanitizeErrors.length) {
      errorCallback(sanitizeErrors.join('.  '))
      return
    }

    if (meta.tags.length > 5) {
      const includingCategory = isEdit
        ? ` (including the category '${rootCategory}')`
        : ''
      errorCallback(`You have ${meta.tags.length} tags total${includingCategory}.  Please use only 5 in your post and category line.`)
      return
    }

    startLoadingIndicator()

    const originalBody = isEdit
      ? originalPost.body
      : null
    const __config = {
      originalBody,
      autoVote
    }

    // Avoid changing payout option during edits #735
    if (!isEdit) {
      switch (payoutType) {
        case '0%': // decline payout
          __config.comment_options = {
            max_accepted_payout: '0.000 ' + DEBT_TICKER
          }
          break;
        case '100%': // 100% steem power payout
          __config.comment_options = {
            percent_steem_dollars: 0, // 10000 === 100% (of 50%)
          }
          break;
        default: // 50% steem power, 50% sd+steem
      }
    }

    const operation = {
      ...linkProps,
      category: rootCategory,
      title,
      body,
      json_metadata: meta,
      __config
    }
    var determineLanguage = (data) => {
      fetch($STM_Config.lang_server, {
        method: 'post',
        mode: 'no-cors',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json'
        },
          body: JSON.stringify({text: body})
        })
        .then(r => r.json())
        .then(res => {
          if (res.error || res.status !== 'ok') {
            console.error('Determine language server error', res.error);
          } else {
            if (res.iso6391code) {
              data.operation.json_metadata.language = res.iso6391code
            }
            dispatch(transaction.actions.broadcastOperation(data))
          }
        })
        .catch(error => {
          console.error('Caught determine language code server error', error);
          dispatch(transaction.actions.broadcastOperation(data))
        });
    }
    dispatch(transaction.actions.broadcastOperation({type: 'comment', operation, errorCallback, successCallback}))
  }
}))(GolosEditor)
