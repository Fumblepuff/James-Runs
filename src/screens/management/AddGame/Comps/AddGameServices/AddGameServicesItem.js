
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';
import {
  Row,
  Col,
} from 'native-base';

import CheckBox from 'src/components/CheckBox';
import Radio from 'src/components/Radio';
import TextInput from 'src/components/TextInput';

import {
  gs,
} from 'src/styles';

const AddGameServicesItem = ({
  data,
  onCheckbox,
  onRadio,
}) => {
  const {
    name,
    price,
    options,
    isSelected,
  } = data;
  const isSelectedFormat = isSelected === 'Yes';

  const renderTeamList = () => {
    const optionsLength = options.length;

    if (optionsLength < 1) {
      return null;
    }

    if (!isSelectedFormat) {
      return null;
    }

    return (
      <Row style={[gs.jCCenter, gs.mT20]}>
        <Col style={[gs.row, gs.jCSpaceBetween, gs.flex08]}>
          {options.map((optionTmp, index) => {
            const { name: nameTmp, isSelected: isSelectedTmp } = optionTmp;
            const isSelectedTmpFormat = isSelectedTmp === 'Yes';
            const style = (index === 1) ? gs.mL15 : null;

            return (
              <Radio
                key={index.toString()}
                text={nameTmp}
                checked={isSelectedTmpFormat}
                style={style}
                onPress={() => {
                  if (isSelectedTmpFormat) {
                    return;
                  }

                  onRadio(data, optionTmp);
                }}
              />
            );
          })}
        </Col>
      </Row>
    );
  };

  return (
    <View style={gs.mT20}>
      <Row>
        <Col style={[gs.border, gs.mT5]}>
          <CheckBox
            text={name}
            style={gs.mB0}
            checked={isSelectedFormat}
            onPress={() => {
              onCheckbox(data, !isSelectedFormat);
            }}
          />
        </Col>

        <Col style={[gs.aIEnd, gs.flexUndef, gs.width150]}>
          <TextInput
            isFullWidth
            small
            editable={false}
            value={`$${price}`}
          />
        </Col>
      </Row>
      {renderTeamList()}
    </View>
  );
};

AddGameServicesItem.propTypes = {
  data: PropTypes.object.isRequired,
  onCheckbox: PropTypes.func.isRequired,
  onRadio: PropTypes.func.isRequired,
};

export default AddGameServicesItem;
