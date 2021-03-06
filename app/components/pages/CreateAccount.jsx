import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import tt from 'counterpart';
import cn from 'classnames';
import { api } from 'golos-js';
import { PrivateKey } from 'golos-js/lib/auth/ecc';
import LoadingIndicator from '@elements/LoadingIndicator';
import user from 'app/redux/User';
import { validate_account_name } from 'app/utils/ChainValidation';
import runTests from 'app/utils/BrowserTests';
import g from 'app/redux/GlobalReducer';
import GeneratedPasswordInput from '@elements/GeneratedPasswordInput';
import CountryCode from '@elements/CountryCode';
import { APP_DOMAIN, SUPPORT_EMAIL, SMS_SERVICES } from 'app/client_config';
import { successReg } from 'app/utils/Analytics';

class CreateAccount extends React.Component {
    static propTypes = {
        loginUser: PropTypes.func.isRequired,
        serverBusy: PropTypes.bool,
    };

    state = {
        fetchState: {
            checking: false,
            success: false,
            status: '',
            message: '',
            showCheckInfo: false,
        },
        fetchCounter: 0,
        phone: '',
        country: 7,
        name: '',
        email: '',
        password: '',
        passwordValid: '',
        nameError: '',
        phoneHint: '',
        phoneError: '',
        serverError: '',
        loading: false,
        cryptographyFailure: false,
        showRules: false,
        allBoxChecked: false,
        iSent: false,
        showHowMuchHelp: false,
    };

    componentDidMount() {
        const cryptoTestResult = runTests();
        if (cryptoTestResult !== undefined) {
            console.error(
                'CreateAccount - cryptoTestResult: ',
                cryptoTestResult
            );
            this.setState({ cryptographyFailure: true });
        }
        this.onCheckCode();
    }

    componentWillUnmount() {
        clearTimeout(this._timeoutId);
        clearTimeout(this._waitTimeout);
    }

    render() {
        if (!process.env.BROWSER) {
            return (
                <div className="row">
                    <div className="column">{tt('g.loading')}...</div>
                </div>
            );
        }

        const { loggedIn, offchainUser, serverBusy } = this.props;
        const {
            fetchState,
            phone,
            country,
            email,
            name,
            passwordValid,
            nameError,
            phoneHint,
            phoneError,
            serverError,
            loading,
            cryptographyFailure,
            allBoxChecked,
        } = this.state;

        if (serverBusy || $STM_Config.disable_signups) {
            return this._renderInvitationError();
        }

        if (cryptographyFailure) {
            return this._renderCryptoFailure();
        }

        if (loggedIn) {
            return this._renderLoggedWarning();
        }

        if (offchainUser && offchainUser.get('account')) {
            return this._renderExistingUserAccount(offchainUser.get('account'));
        }

        let phoneStep = null;
        let showMobileForm =
            fetchState.status !== 'waiting' && fetchState.status !== 'done';

        if (fetchState.status === 'waiting') {
            phoneStep = this._renderCodeWaiting();
        } else if (fetchState.message) {
            phoneStep = (
                <div
                    className={cn('callout', {
                        success: fetchState.success,
                        alert: !fetchState.success,
                    })}
                >
                    {fetchState.message}
                </div>
            );
        }

        let nextStep = null;

        if (serverError) {
            if (serverError === 'Email address is not confirmed') {
                nextStep = (
                    <div className="callout alert">
                        <a href="/enter_email">{tt('tips_js.confirm_email')}</a>
                    </div>
                );
            } else if (serverError === 'Phone number is not confirmed') {
                nextStep = (
                    <div className="callout alert">
                        <a href="/enter_mobile">
                            {tt('tips_js.confirm_phone')}
                        </a>
                    </div>
                );
            } else {
                nextStep = (
                    <div className="callout alert">
                        <strong>
                            {tt(
                                'createaccount_jsx.couldnt_create_account_server_returned_error'
                            )}:
                        </strong>
                        <p>{serverError}</p>
                    </div>
                );
            }
        }

        const okStatus = fetchState.checking && fetchState.success;

        const submitDisabled =
            loading ||
            !name ||
            nameError ||
            !passwordValid ||
            !allBoxChecked ||
            !okStatus;

        const disableGetCode = okStatus || !phoneHint;

        return (
            <div>
                <div className="CreateAccount row">
                    <div
                        className="column"
                        style={{ maxWidth: '36rem', margin: '0 auto' }}
                    >
                        <h2>{tt('g.sign_up')}</h2>
                        <hr />
                        <form
                            onSubmit={this._onSubmit}
                            autoComplete="off"
                            noValidate
                            method="post"
                        >
                            <div className="CreateAccount__hello">
                                {tt('createaccount_jsx.dont_close')}
                            </div>
                            {showMobileForm && (
                                <div>
                                    <div>
                                        <label>
                                            <span style={{ color: 'red' }}>
                                                *
                                            </span>{' '}
                                            {tt(
                                                'createaccount_jsx.country_code'
                                            )}
                                            <CountryCode
                                                onChange={this.onCountryChange}
                                                disabled={fetchState.checking}
                                                name="country"
                                                value={country}
                                            />
                                        </label>
                                        <p />
                                    </div>
                                    <div
                                        className={cn({
                                            error: phoneError,
                                            success: phoneHint,
                                        })}
                                    >
                                        <label>
                                            <span style={{ color: 'red' }}>
                                                *
                                            </span>{' '}
                                            {tt(
                                                'createaccount_jsx.phone_number'
                                            )}{' '}
                                            <span style={{ color: 'red' }}>
                                                {tt(
                                                    'createaccount_jsx.without_country_code'
                                                )}
                                            </span>
                                            <input
                                                type="text"
                                                name="phone"
                                                autoComplete="off"
                                                disabled={fetchState.checking}
                                                onChange={this.onMobileChange}
                                                onBlur={this._onMobileBlur}
                                                value={phone}
                                            />
                                        </label>
                                        <p>{phoneError || phoneHint}</p>
                                    </div>
                                </div>
                            )}
                            {phoneStep}
                            {showMobileForm && (
                                <p>
                                    <a
                                        className={cn('button', {
                                            disabled: disableGetCode,
                                        })}
                                        onClick={
                                            !disableGetCode
                                                ? this.onClickSendCode
                                                : null
                                        }
                                    >
                                        {tt('g.continue')}
                                    </a>
                                </p>
                            )}
                            {fetchState.showCheckInfo
                                ? this._renderCheckInfo()
                                : null}

                            <div className="success">
                                <label>
                                    {tt('createaccount_jsx.enter_email')}
                                    <input
                                        type="email"
                                        name="email"
                                        autoComplete="off"
                                        disabled={!okStatus}
                                        onChange={this.onEmailChange}
                                        value={email}
                                    />
                                </label>
                                <p />
                            </div>
                            <div className={nameError ? 'error' : ''}>
                                <label>
                                    {tt('createaccount_jsx.enter_account_name')}
                                    <input
                                        type="text"
                                        name="name"
                                        autoComplete="off"
                                        disabled={!okStatus}
                                        onChange={this.onNameChange}
                                        value={name}
                                    />
                                    <div className="CreateAccount__account-name-hint">
                                        {tt(
                                            'createaccount_jsx.account_name_hint'
                                        )}
                                    </div>
                                </label>
                                <p>{nameError}</p>
                            </div>
                            <GeneratedPasswordInput
                                onChange={this.onPasswordChange}
                                disabled={!okStatus || loading}
                                showPasswordString={
                                    name.length > 0 && !nameError
                                }
                            />
                            <br />
                            {nextStep}
                            <noscript>
                                <div className="callout alert">
                                    <p>
                                        {tt(
                                            'createaccount_jsx.form_requires_javascript_to_be_enabled'
                                        )}
                                    </p>
                                </div>
                            </noscript>
                            {loading && <LoadingIndicator type="circle" />}
                            <button
                                disabled={submitDisabled}
                                className={cn('button action uppercase', {
                                    disabled: submitDisabled,
                                })}
                            >
                                {tt('createaccount_jsx.create_account')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    _renderExistingUserAccount(existingUserAccount) {
        const APP_NAME = tt('g.APP_NAME');

        return (
            <div className="row">
                <div className="column">
                    <div className="callout alert">
                        <p>
                            {tt(
                                'createaccount_jsx.our_records_indicate_you_already_have_account',
                                { APP_NAME }
                            )}: <strong>{existingUserAccount}</strong>
                        </p>
                        <p>
                            {tt(
                                'createaccount_jsx.in_order_to_prevent_abuse_APP_NAME_can_only_register_one_account_per_user',
                                { APP_NAME }
                            )}
                        </p>
                        <p>
                            {tt(
                                'createaccount_jsx.next_3_blocks.you_can_either'
                            ) + ' '}
                            <a href="/login.html">{tt('g.login')}</a>
                            {tt(
                                'createaccount_jsx.next_3_blocks.to_your_existing_account_or'
                            ) + ' '}
                            <a href={'mailto:' + SUPPORT_EMAIL}>
                                {tt('createaccount_jsx.send_us_email')}
                            </a>
                            {' ' +
                                tt(
                                    'createaccount_jsx.next_3_blocks.if_you_need_a_new_account'
                                )}.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    _renderCodeWaiting() {
        const { country, fetchState, iSent, showHowMuchHelp } = this.state;

        return (
            <div className="callout">
                <div className="CreateAccount__send-sms-block">
                    {tt('g.please')},{' '}
                    <b>
                        {tt('mobilevalidation_js.waiting_from_you_line_1', {
                            code: fetchState.code,
                            phone:
                                SMS_SERVICES[country] ||
                                SMS_SERVICES['default'],
                        })}
                    </b>
                </div>
                <div>{tt('mobilevalidation_js.waiting_from_you_line_2')}</div>
                <div className="CreateAccount__hint-block">
                    <span
                        className="CreateAccount__hint"
                        onClick={this._onHowMuchClick}
                    >
                        {tt('createaccount_jsx.sms_how_much')}
                    </span>
                    {showHowMuchHelp ? (
                        <div className="CreateAccount__how-much-text">
                            {tt('createaccount_jsx.sms_how_much_answer')}
                        </div>
                    ) : null}
                </div>
                <p>
                    <small>
                        {tt('mobilevalidation_js.you_can_change_your_number') +
                            ' '}
                        <a onClick={this.onClickSelectAnotherPhone}>
                            {tt('mobilevalidation_js.select_another_number')}
                        </a>.
                    </small>
                </p>
                <div>
                    <label className="CreateAccount__check-section">
                        <input
                            type="checkbox"
                            checked={iSent}
                            disabled={iSent}
                            onChange={this._onISendClick}
                        />
                        {tt('createaccount_jsx.sent_sms')}
                    </label>
                    {iSent ? (
                        <div>
                            <div>
                                {tt('createaccount_jsx.sent_sms_description')}
                            </div>
                            <div className="CreateAccount__loader">
                                <LoadingIndicator type="circle" size="40px" />
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }

    _renderInvitationError() {
        return (
            <div className="row">
                <div className="column">
                    <div className="callout alert">
                        <p>
                            {tt('g.membership_invitation_only', {
                                APP_DOMAIN,
                            })}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    _renderLoggedWarning() {
        const APP_NAME = tt('g.APP_NAME');

        return (
            <div className="row">
                <div className="column">
                    <div className="callout alert">
                        <p>
                            {tt('createaccount_jsx.you_need_to')}
                            <a href="#" onClick={this._onLogoutClick}>
                                {tt('g.logout')}
                            </a>
                            {tt('createaccount_jsx.before_creating_account')}
                        </p>
                        <p>
                            {tt(
                                'createaccount_jsx.APP_NAME_can_only_register_one_account_per_verified_user',
                                { APP_NAME }
                            )}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    _renderCryptoFailure() {
        const APP_NAME = tt('g.APP_NAME');

        return (
            <div className="row">
                <div className="column">
                    <div className="callout alert">
                        <h4>
                            {tt('createaccount_jsx.ctyptography_test_failed')}
                        </h4>
                        <p>
                            {tt(
                                'createaccount_jsx.we_will_be_unable_to_create_account_with_this_browser',
                                { APP_NAME }
                            )}.
                        </p>
                        <p>
                            {tt('loginform_jsx.the_latest_versions_of') + ' '}
                            <a href="https://www.google.com/chrome/">Chrome</a>
                            {' ' + tt('g.and')}
                            <a href="https://www.mozilla.org/en-US/firefox/new/">
                                Firefox
                            </a>
                            {' ' +
                                tt(
                                    'loginform_jsx.are_well_tested_and_known_to_work_with',
                                    { APP_DOMAIN }
                                )}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    _renderCheckInfo() {
        return (
            <p className="CreateAccount__check-info">
                {tt('createaccount_jsx.check_code')}{' '}
                <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
            </p>
        );
    }

    _onHowMuchClick = () => {
        this.setState({
            showHowMuchHelp: !this.state.showHowMuchHelp,
        });
    };

    _onISendClick = () => {
        this.setState({
            iSent: true,
        });
    };

    _onSubmit = async e => {
        e.preventDefault();
        this.setState({ serverError: '', loading: true });
        const { email, name, password, passwordValid } = this.state;
        if (!name || !password || !passwordValid) return;

        let publicKeys;
        try {
            const pk = PrivateKey.fromWif(password);
            publicKeys = [1, 2, 3, 4].map(() => pk.toPublicKey().toString());
        } catch (err) {
            publicKeys = ['owner', 'active', 'posting', 'memo'].map(role =>
                PrivateKey.fromSeed(`${name}${role}${password}`)
                    .toPublicKey()
                    .toString()
            );
        }

        try {
            // createAccount
            const res = await callApi('/api/v1/accounts', {
                csrf: $STM_csrf,
                email,
                name,
                owner_key: publicKeys[0],
                active_key: publicKeys[1],
                posting_key: publicKeys[2],
                memo_key: publicKeys[3],
            });

            const data = await res.json();

            if (data.error || data.status !== 'ok') {
                console.error('CreateAccount server error', data.error);
                this.setState({
                    serverError: data.error || tt('g.unknown'),
                    loading: false,
                });
            } else {
                successReg();
                window.location = `/login.html#account=${name}&msg=accountcreated`;
            }
        } catch (err) {
            console.error('Caught CreateAccount server error', err);
            this.setState({
                serverError: err.message ? err.message : err,
                loading: false,
            });
        }
    };

    onPasswordChange = (password, passwordValid, allBoxChecked) => {
        this.setState({ password, passwordValid, allBoxChecked });
    };

    onCountryChange = e => {
        const country = e.target.value.trim().toLowerCase();
        const phoneHint = this.state.phone.length
            ? tt('createaccount_jsx.will_be_send_to_phone_number') +
              country +
              this.state.phone
            : '';
        this.setState({ country, phoneHint });
    };

    onMobileChange = e => {
        const phone = e.target.value.trim().toLowerCase();
        this.validateMobilePhone(phone);
        this.setState({ phone });
    };

    _onMobileBlur = () => {
        const { phone } = this.state;
        this.validateMobilePhone(phone, true);
    };

    validateMobilePhone = (value, isFinal) => {
        let phoneError = null;
        let phoneHint = null;

        if (!value) {
            phoneError = tt('mobilevalidation_js.not_be_empty');
        } else if (!/^[0-9]{1,45}$/.test(value)) {
            phoneError = tt('mobilevalidation_js.have_only_digits');
        } else if (value.length < 7 && isFinal) {
            phoneError = tt('mobilevalidation_js.be_longer');
        }

        if (phoneError) {
            phoneError =
                tt('createaccount_jsx.phone_number') + ' ' + phoneError;
        } else {
            phoneHint =
                tt('createaccount_jsx.will_be_send_to_phone_number') +
                this.state.country +
                value;
        }

        this.setState({ phoneError, phoneHint });
    };

    updateFetchingState(res) {
        const fetchState = {
            checking: false,
            success: false,
            status: res.status,
            message: '',
            showCheckInfo: false,
        };

        if (res.status !== 'waiting') {
            clearTimeout(this._waitTimeout);
        }

        switch (res.status) {
            case 'select_country':
                fetchState.message = 'Please select a country code';
                break;

            case 'provide_phone':
                fetchState.message = 'Please provide a phone number';
                break;

            case 'already_used':
                fetchState.message = tt(
                    'createaccount_jsx.this_phone_number_has_already_been_used'
                );
                break;

            case 'session':
                fetchState.message = '';
                break;

            case 'waiting':
                fetchState.checking = true;
                fetchState.showCheckInfo = this.state.fetchState.showCheckInfo;
                fetchState.code = res.code;
                this._startWaitingTimer();
                break;

            case 'done':
                fetchState.checking = true;
                fetchState.success = true;
                fetchState.message = tt(
                    'createaccount_jsx.phone_number_has_been_verified'
                );
                break;

            case 'attempts_10':
                fetchState.checking = true;
                fetchState.message = tt('mobilevalidation_js.attempts_10');
                break;

            case 'attempts_300':
                fetchState.checking = true;
                fetchState.message = tt('mobilevalidation_js.attempts_300');
                break;

            case 'error':
                fetchState.message = res.error;
                break;

            default:
                fetchState.message = tt('g.unknown');
                break;
        }

        this.setState({ fetchState });
    }

    onClickSelectAnotherPhone = () => {
        clearTimeout(this._timeoutId);
        this.setState({ fetchState: { checking: false } });
    };

    onClickSendCode = async () => {
        const { phone, country } = this.state;

        this.setState({
            fetchCounter: 0,
            fetchState: { checking: true },
        });

        try {
            const res = await callApi('/api/v1/send_code', {
                csrf: $STM_csrf,
                phone,
                country,
            });

            let data = null;

            if (res.status === 200) {
                data = await res.json();
            } else {
                let message = res.status + ' ' + res.statusText;

                if (res.status === 429) {
                    message += '. Please wait a moment and try again.';
                }

                data = {
                    status: 'error',
                    error: message,
                };
            }

            this.updateFetchingState(data);
        } catch (err) {
            console.error('Caught /send_code server error', err);

            this.updateFetchingState({
                status: 'error',
                error: err.message ? err.message : err,
            });
        }
    };

    onCheckCode = async () => {
        try {
            const res = await callApi('/api/v1/check_code', {
                csrf: $STM_csrf,
            });

            let data;
            if (res.status === 200) {
                data = await res.json();
            } else {
                data = {
                    status: 'error',
                    error: res.status + ' ' + res.statusText,
                };
            }

            this.updateFetchingState(data);
        } catch (err) {
            console.error('Caught /check_code server error:', err);
            this.updateFetchingState({
                status: 'error',
                error: err.message ? err.message : err,
            });
        }
    };

    onNameChange = e => {
        const name = e.target.value.trim().toLowerCase();
        this.validateAccountName(name);
        this.setState({ name });
    };

    async validateAccountName(name) {
        let nameError = '';

        if (name.length > 0) {
            nameError = validate_account_name(name);

            if (!nameError) {
                try {
                    const res = await api.getAccountsAsync([name]);

                    if (res && res.length > 0) {
                        nameError = tt(
                            'createaccount_jsx.account_name_already_used'
                        );
                    }
                } catch (err) {
                    nameError = tt('createaccount_jsx.account-name-hint');
                }
            }
        }

        this.setState({ nameError });
    }

    onEmailChange = e => {
        this.setState({
            email: e.target.value.trim().toLowerCase(),
        });
    };

    _onLogoutClick = e => {
        e.preventDefault();
        this.props.logout();
    };

    _startWaitingTimer() {
        const fetchCounter = this.state.fetchCounter + 1;

        if (fetchCounter < 429) {
            this.setState({ fetchCounter });
            this._timeoutId = setTimeout(
                this.onCheckCode,
                1000 * Math.ceil(11 + Math.sqrt(fetchCounter))
            );
        }

        this._waitTimeout = setTimeout(() => {
            const { fetchState } = this.state;

            if (fetchState.status === 'waiting' && fetchState.checking) {
                fetchState.showCheckInfo = true;
                this.forceUpdate();
            }
        }, 60 * 1000);
    }
}

function callApi(apiName, data) {
    return fetch(apiName, {
        method: 'post',
        mode: 'no-cors',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

module.exports = {
    path: 'create_account',
    component: connect(
        state => ({
            loggedIn: !!state.user.get('current'),
            offchainUser: state.offchain.get('user'),
            serverBusy: state.offchain.get('serverBusy'),
            suggestedPassword: state.global.get('suggestedPassword'),
        }),
        {
            loginUser: (username, password) =>
                user.actions.usernamePasswordLogin({
                    username,
                    password,
                    saveLogin: true,
                }),
            logout: () => user.actions.logout(),
        }
    )(CreateAccount),
};
