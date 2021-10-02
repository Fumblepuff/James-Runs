
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Text,
  Grid,
  Row,
  Col,
  Button,
} from 'native-base';
import {
  useSelector,
  useDispatch,
} from 'react-redux';

import {
  Children,
} from 'src/common/Types';

import GameApi from 'src/api/GameApi';

import StripeUtils from 'src/utils/StripeUtils';
import Toast from 'src/utils/toastUtils';
import generalUtils from 'src/utils/generalUtils';

import {
  gamesNewEventForm1Selector,
  gamesNewEventUpdateData,
  gamesNewEventEventRequestIdSelector,
} from 'src/reducers/games';

import {
  gs,
} from 'src/styles';

const AddGamePay = ({
  children,
  onPaymentSuccess,
}) => {
  const dispatch = useDispatch();
  const eventRequestId = useSelector(gamesNewEventEventRequestIdSelector);
  const { services, eventLevelId, orderTotals } = useSelector(gamesNewEventForm1Selector);

  const listServices = services.filter(({ isSelected }) => (isSelected === 'Yes'));
  const gameLevel = eventLevelId.options.find(({ isSelected }) => (isSelected === 'Yes'));

  const onPay = async () => {
    let clientSecret;
    let stripeApiKeyPublishable;

    try {
      const resApi = await GameApi.eventRequestPaymentIntentHold(eventRequestId);

      stripeApiKeyPublishable = resApi.publicKey;
      clientSecret = resApi.paymentIntent.clientSecret;
    } catch (e) {
      Toast.showError(e);
      return;
    }

    await generalUtils.sleep(500);

    const resPayment = await StripeUtils.payment(stripeApiKeyPublishable, clientSecret);

    if (resPayment.error) {
      Toast.showError(resPayment.error);
      return;
    }

    onPaymentSuccess();
  };

  const onRemoveService = (item) => {
    if (listServices.length === 1) {
      Toast.showError('You should have at least one service.');
      return;
    }

    const removeService = async () => {
      try {
        const itemReq = {
          id: item.id,
          isSelected: 'No',
        };

        const respApi = await GameApi.setEventForm1Data({
          eventRequestId,
          services: [
            itemReq,
          ],
        });

        dispatch(gamesNewEventUpdateData({
          form1: respApi,
        }));
      } catch (e) {
        Toast.showError(e);
      }
    };

    Alert.alert(
      'Are you sure?',
      'Game will be deleted.',
      [
        {
          text: 'OK',
          onPress: removeService,
        },
        {
          text: 'Cancel',
          onPress: () => {

          },
        },
      ],
      { cancelable: true },
    );
  };

  const renderItem = (item, index) => {
    const { name, price, options } = item;
    let optionName = '';

    if (options && Array.isArray(options)) {
      const option = options.find(({ isSelected }) => (isSelected === 'Yes'));
      if (option) {
        optionName = ` (${option.name})`;
      }
    }

    return (
      <Grid
        key={index.toString()}
        style={gs.mT15}
      >
        <Row>
          <Col>
            <Text white bold style={gs.fS18}>
              {name}
              {optionName}
            </Text>
          </Col>
          <Col style={gs.aIEnd}>
            <Text white bold style={gs.fS18}>{`$${price}`}</Text>
          </Col>
        </Row>
        <Row style={gs.mT5}>
          <Col>
            <Text style={gs.colorGray}>
              Game Level:&nbsp;
              {gameLevel.name}
            </Text>
          </Col>
          {/* <Col style={gs.aIEnd}>
            <View style={gs.row}>
              <Text white style={[gs.mR20, gs.colorGray]}>Qty</Text>
              <Text white bold>1</Text>
            </View>
          </Col> */}
        </Row>
        <Row style={[gs.jCEnd, gs.mT10]}>
          <TouchableOpacity
            onPress={() => {
              onRemoveService(item);
            }}
          >
            <Text style={[gs.colorGray, gs.fS18]}>Remove</Text>
          </TouchableOpacity>
        </Row>
      </Grid>
    );
  };

  const renderTotal = () => {
    const { subTotal, tax, grandTotal } = orderTotals;

    return (
      <Grid style={gs.mT20}>
        <Row style={gs.jCSpaceBetween}>
          <Text style={gs.colorGray}>Subtotal</Text>
          <Text style={gs.colorGray}>{`$${subTotal}`}</Text>
        </Row>

        <Row style={gs.jCSpaceBetween}>
          <Text style={gs.colorGray}>Tax</Text>
          <Text style={gs.colorGray}>{`$${tax}`}</Text>
        </Row>

        <Row style={[gs.jCSpaceBetween, gs.mT10]}>
          <Text white bold>Total</Text>
          <Text white bold>{`$${grandTotal}`}</Text>
        </Row>
      </Grid>
    );
  };

  return (
    <View style={gs.mT0}>
      <Text white bold style={[gs.fS22, gs.mB10]}>Order Summary</Text>
      {listServices.map((item, index) => renderItem(item, index))}
      {renderTotal()}

      {children}

      <Button
        style={[gs.mT10, gs.aSCenter, gs.mB20]}
        onPress={onPay}
      >
        <Text style={[gs.mL30, gs.mR30]}>Pay</Text>
      </Button>
    </View>
  );
};

AddGamePay.propTypes = {
  children: Children.isRequired,
  onPaymentSuccess: PropTypes.func.isRequired,
};

export default AddGamePay;
