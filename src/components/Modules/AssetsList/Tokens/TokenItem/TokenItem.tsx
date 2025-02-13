import isEqual from 'lodash/isEqual';

import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';

import { Button, AmountText, Icon, TokenAvatar, TokenIcon } from '@components/General';

import { NormalizeCurrencyCode } from '@common/utils/amount';

import { TrustLineModel } from '@store/models';

import Localize from '@locale';

import { AppStyles, AppSizes } from '@theme';
import styles from './styles';

/* Types ==================================================================== */
interface Props {
    token: TrustLineModel;
    index: number;
    selfIssued: boolean;
    reorderEnabled: boolean;
    discreetMode: boolean;
    onPress: (token: TrustLineModel, index: number) => void;
    onMoveTopPress: (token: TrustLineModel, index: number) => void;
}

interface State {
    balance: string;
    favorite: boolean;
    no_ripple: boolean;
    limit: string;
}

/* Component ==================================================================== */
class TokenItem extends PureComponent<Props, State> {
    static Height = AppSizes.scale(55);

    constructor(props: Props) {
        super(props);

        this.state = {
            balance: props.token.balance,
            favorite: props.token.favorite,
            no_ripple: props.token.no_ripple,
            limit: props.token.limit,
        };
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: State): State {
        if (
            !isEqual(nextProps.token.balance, prevState.balance) ||
            !isEqual(nextProps.token.favorite, prevState.favorite) ||
            !isEqual(nextProps.token.no_ripple, prevState.no_ripple) ||
            !isEqual(nextProps.token.limit, prevState.limit)
        ) {
            return {
                balance: nextProps.token.balance,
                favorite: nextProps.token.favorite,
                no_ripple: nextProps.token.no_ripple,
                limit: nextProps.token.limit,
            };
        }
        return null;
    }

    onPress = () => {
        const { index, token, onPress } = this.props;

        if (typeof onPress === 'function') {
            onPress(token, index);
        }
    };

    onMoveTopPress = () => {
        const { index, token, onMoveTopPress } = this.props;

        if (typeof onMoveTopPress === 'function') {
            onMoveTopPress(token, index);
        }
    };

    getIssuerLabel = () => {
        const { selfIssued, token } = this.props;

        if (selfIssued) return Localize.t('home.selfIssued');

        if (token.currency.name) {
            return `${token.counterParty.name} ${NormalizeCurrencyCode(token.currency.currency)}`;
        }

        return `${token.counterParty.name}`;
    };

    getCurrencyName = () => {
        const { token } = this.props;

        if (token.currency.name) {
            return `${token.currency.name}`;
        }

        return NormalizeCurrencyCode(token.currency.currency);
    };

    getTokenAvatar = () => {
        const { token } = this.props;
        const { favorite, no_ripple, limit } = this.state;

        let badge = null as any;

        if (favorite) {
            badge = (
                <View style={styles.iconFavoriteContainer}>
                    <Icon name="IconStarFull" size={10} style={styles.iconFavorite} />
                </View>
            );
        }

        // show alert on top of avatar if rippling set
        if ((no_ripple === false || Number(limit) === 0) && !token.obligation) {
            badge = <Icon name="ImageTriangle" size={15} />;
        }

        return <TokenAvatar token={token} border size={35} badge={() => badge} />;
    };

    renderReorderButtons = () => {
        const { index } = this.props;

        return (
            <View style={styles.reorderButtonContainer}>
                {index > 0 && (
                    <Button
                        onPress={this.onMoveTopPress}
                        iconSize={13}
                        iconStyle={AppStyles.imgColorGrey}
                        icon="IconSortTop"
                        roundedSmall
                        light
                        style={styles.reorderButton}
                    />
                )}
                <Button
                    iconSize={15}
                    iconStyle={AppStyles.imgColorGrey}
                    icon="IconReorderHandle"
                    roundedSmall
                    light
                    isDisabled
                    style={styles.reorderButton}
                    disabledStyle={{}}
                />
            </View>
        );
    };

    renderBalance = () => {
        const { token, discreetMode } = this.props;
        const { balance } = this.state;

        return (
            <AmountText
                prefix={
                    <TokenIcon
                        token={token}
                        containerStyle={styles.tokenIconContainer}
                        style={discreetMode && AppStyles.imgColorGrey}
                    />
                }
                value={balance}
                style={[AppStyles.pbold, AppStyles.monoBold]}
                discreet={discreetMode}
                discreetStyle={AppStyles.colorGrey}
            />
        );
    };

    render() {
        const { token, reorderEnabled } = this.props;

        return (
            <View testID={`${token.currency.id}`} style={[styles.currencyItem, { height: TokenItem.Height }]}>
                <View style={[AppStyles.flex1, AppStyles.row, AppStyles.centerAligned]}>
                    <View style={styles.tokenAvatarContainer}>{this.getTokenAvatar()}</View>
                    <View style={[AppStyles.column, AppStyles.centerContent]}>
                        <Text numberOfLines={1} style={styles.currencyLabel}>
                            {this.getCurrencyName()}
                        </Text>
                        <Text numberOfLines={1} style={styles.issuerLabel}>
                            {this.getIssuerLabel()}
                        </Text>
                    </View>
                </View>
                <View style={styles.balanceContainer}>
                    {reorderEnabled ? this.renderReorderButtons() : this.renderBalance()}
                </View>
            </View>
        );
    }
}

export default TokenItem;
