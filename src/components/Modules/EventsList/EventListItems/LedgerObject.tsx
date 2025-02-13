import React, { Component } from 'react';
import { InteractionManager, View } from 'react-native';
import { isEmpty, isEqual } from 'lodash';

import { AccountModel } from '@store/models';

import { AppScreens } from '@common/constants';

import { LedgerObjects } from '@common/libs/ledger/objects/types';
import { LedgerObjectTypes } from '@common/libs/ledger/types';
import { ExplainerFactory } from '@common/libs/ledger/factory';

import { Navigator } from '@common/helpers/navigator';
import { getAccountName } from '@common/helpers/resolver';

import { NormalizeAmount, NormalizeCurrencyCode } from '@common/utils/amount';
import { Truncate } from '@common/utils/string';

import { AmountText, Avatar, TextPlaceholder, TouchableDebounce } from '@components/General';

import Localize from '@locale';

import { AppSizes, AppStyles } from '@theme';
import styles from './styles';

/* types ==================================================================== */
export interface Props {
    account: AccountModel;
    item: LedgerObjects;
    timestamp?: number;
}

export interface State {
    isLoading: boolean;
    recipientDetails: {
        address: string;
        tag?: number;
        name?: string;
        kycApproved?: boolean;
    };
    label: string;
}

/* Component ==================================================================== */
class LedgerObjectItem extends Component<Props, State> {
    static Height = AppSizes.heightPercentageToDP(7.5);

    private mounted = false;

    constructor(props: Props) {
        super(props);

        this.state = {
            isLoading: true,
            recipientDetails: undefined,
            label: undefined,
        };
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        const { timestamp } = this.props;
        return !isEqual(nextState, this.state) || !isEqual(nextProps.timestamp, timestamp);
    }

    componentDidMount() {
        // track mounted
        this.mounted = true;

        // fetch recipient details
        InteractionManager.runAfterInteractions(this.setDetails);
    }

    componentDidUpdate(prevProps: Props) {
        const { timestamp } = this.props;

        // force the lookup if timestamp changed
        if (timestamp !== prevProps.timestamp) {
            InteractionManager.runAfterInteractions(this.setDetails);
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    setDetails = async () => {
        const { isLoading } = this.state;
        const { item, account } = this.props;

        // set is loading flag if not true
        if (!isLoading) {
            this.setState({
                isLoading: true,
            });
        }

        // fetch explainer
        const objectExplainer = ExplainerFactory.fromType(item.Type);

        // get label
        const objectLabel = objectExplainer.getLabel(item, account);

        // get recipient
        let recipient = objectExplainer.getRecipient(item, account);

        // if there is no recipient then load account address
        if (isEmpty(recipient)) {
            recipient = {
                address: account.address,
            };
        }

        try {
            // getRecipient
            const resp = await getAccountName(recipient.address, recipient.tag);
            if (!isEmpty(resp) && this.mounted) {
                this.setState({
                    label: objectLabel,
                    recipientDetails: {
                        ...recipient,
                        name: resp.name,
                        kycApproved: resp.kycApproved,
                    },
                    isLoading: false,
                });
            }
        } catch (error) {
            if (this.mounted) {
                this.setState({
                    label: objectLabel,
                    recipientDetails: { ...recipient },
                    isLoading: false,
                });
            }
        }
    };

    onPress = () => {
        const { item, account } = this.props;
        Navigator.push(AppScreens.Transaction.Details, { tx: item, account });
    };

    getIcon = () => {
        const { recipientDetails, isLoading } = this.state;

        return (
            <View style={styles.iconContainer}>
                <Avatar
                    badge={recipientDetails?.kycApproved ? 'IconCheckXaman' : undefined}
                    border
                    source={{ uri: `https://xumm.app/avatar/${recipientDetails?.address}_180_50.png` }}
                    isLoading={isLoading}
                />
            </View>
        );
    };

    getDescription = () => {
        const { recipientDetails } = this.state;
        const { item } = this.props;

        if (item.Type === LedgerObjectTypes.Offer) {
            return `${Localize.formatNumber(NormalizeAmount(item.TakerGets.value))} ${NormalizeCurrencyCode(
                item.TakerGets.currency,
            )}/${NormalizeCurrencyCode(item.TakerPays.currency)}`;
        }

        if (item.Type === LedgerObjectTypes.NFTokenOffer) {
            return item.NFTokenID;
        }

        if (recipientDetails?.name) return recipientDetails.name;
        if (recipientDetails?.address) return Truncate(recipientDetails.address, 16);

        return Localize.t('global.unknown');
    };

    renderRightPanel = () => {
        const { item, account } = this.props;

        if (item.Type === LedgerObjectTypes.Escrow) {
            const incoming = item.Destination?.address === account.address;
            return (
                <AmountText
                    value={item.Amount.value}
                    currency={item.Amount.currency}
                    prefix={!incoming && '-'}
                    style={[styles.amount, incoming ? styles.orangeColor : styles.outgoingColor]}
                    currencyStyle={styles.currency}
                    valueContainerStyle={styles.amountValueContainer}
                    truncateCurrency
                />
            );
        }

        if (item.Type === LedgerObjectTypes.Check) {
            return (
                <AmountText
                    value={item.SendMax.value}
                    currency={item.SendMax.currency}
                    style={[styles.amount, styles.naturalColor]}
                    currencyStyle={styles.currency}
                    valueContainerStyle={styles.amountValueContainer}
                    truncateCurrency
                />
            );
        }

        if (item.Type === LedgerObjectTypes.Offer) {
            return (
                <AmountText
                    value={item.TakerPays.value}
                    currency={item.TakerPays.currency}
                    style={[styles.amount, styles.naturalColor]}
                    currencyStyle={styles.currency}
                    valueContainerStyle={styles.amountValueContainer}
                    truncateCurrency
                />
            );
        }

        if (item.Type === LedgerObjectTypes.NFTokenOffer) {
            return (
                <AmountText
                    value={item.Amount.value}
                    currency={item.Amount.currency}
                    style={[styles.amount, styles.naturalColor]}
                    currencyStyle={styles.currency}
                    valueContainerStyle={styles.amountValueContainer}
                    truncateCurrency
                />
            );
        }

        return null;
    };

    render() {
        const { label, isLoading } = this.state;

        return (
            <TouchableDebounce
                onPress={this.onPress}
                activeOpacity={0.8}
                style={[styles.container, { height: LedgerObjectItem.Height }]}
            >
                <View style={[AppStyles.flex1, AppStyles.centerContent]}>{this.getIcon()}</View>
                <View style={[AppStyles.flex3, AppStyles.centerContent]}>
                    <TextPlaceholder style={styles.label} numberOfLines={1} isLoading={isLoading}>
                        {this.getDescription()}
                    </TextPlaceholder>

                    <View style={[AppStyles.row, AppStyles.centerAligned]}>
                        <TextPlaceholder style={styles.description} numberOfLines={1} isLoading={isLoading}>
                            {label}
                        </TextPlaceholder>
                    </View>
                </View>
                <View style={[AppStyles.flex2, AppStyles.rightAligned, AppStyles.centerContent]}>
                    {this.renderRightPanel()}
                </View>
            </TouchableDebounce>
        );
    }
}

export default LedgerObjectItem;
