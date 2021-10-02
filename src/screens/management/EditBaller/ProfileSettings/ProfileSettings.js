/* eslint-disable no-alert */

import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TextInput,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Icon,
  Text,
  Button,
} from 'native-base';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';

import AuthApi from 'src/api/AuthApi';
import SkillsApi from 'src/api/SkillsApi';

import ListSkillsCheckbox from 'src/components/ListSkillsCheckbox';
import Spinner from 'src/components/Spinner';
import DateTimePicker from 'src/components/DateTimePicker';

import {
  displayView,
} from 'src/reducers/games';
import {
  authMemberTypesSelector,
} from 'src/reducers/auth';

import {
  gs,
} from 'src/styles';

import styles from 'src/styles/Style';
import formStyles from 'src/styles/Form';

const ProfileSettings = ({
  onHide,
  isVisible,
  userInfo = {},
}) => {
  const memberTypes = useSelector(authMemberTypesSelector());
  const dispatch = useDispatch();
  const currentSkills = React.useRef([]);
  const [form, setForm] = React.useState({});
  const [selectedSkills, setSelectedSkills] = React.useState([]);
  const [defaultSkills, setDefaultSkills] = React.useState([]);
  const [showMemerTypePicker, setShowMemerTypePicker] = React.useState(false);
  const [loadings, setLoading] = React.useState({
    isUpdatingUser: false,
    isGettingPermissions: false,
    isSettingSkills: false,
  });
  const isLoading = (loadings.isUpdatingUser || loadings.isGettingPermissions || loadings.isSettingSkills);
  const baller = userInfo;
  const {
    id: ballerId,
    age,
  } = baller;
  const typeGet = form.type || baller.type;
  const type = parseInt(typeGet, 10);

  const onLoadingSet = (data, error = null) => {
    setLoading({
      ...loadings,
      ...data,
    });

    if (!error) {
      return;
    }

    setTimeout(() => {
      alert(error);
    }, 700);
  };

  const onSetForm = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const onHideInner = () => {
    setForm({});
    setSelectedSkills(currentSkills.current);
    onHide();
  };

  const onUpdateUser = async () => {
    onLoadingSet({
      isUpdatingUser: true,
    });

    const skillsToDelete = currentSkills.current.filter((item) => !selectedSkills.includes(item));
    const skillsToAdd = selectedSkills.filter((item) => !currentSkills.current.includes(item));

    // unset skills first
    try {
      if (skillsToDelete > 0) {
        await SkillsApi.updateUserPermissions(ballerId, skillsToDelete, false);

        const currenSkillsAfterDeleting = currentSkills.current.filter((item) => !skillsToDelete.includes(item));
        currentSkills.current = currenSkillsAfterDeleting;
      }
    } catch (e) {
      onLoadingSet({
        isUpdatingUser: false,
      }, e);

      return;
    }

    // set skills
    try {
      if (skillsToAdd.length > 0) {
        await SkillsApi.updateUserPermissions(baller.id, skillsToAdd);
      }

      currentSkills.current = selectedSkills;
    } catch (e) {
      onLoadingSet({
        isUpdatingUser: false,
      }, e);

      return;
    }

    const userDataUpdate = {
      id: baller.id,
      firstName: form.firstName || baller.firstName,
      lastName: form.lastName || baller.lastName,
      email: form.email || baller.email,
      password: form.password || baller.password,
      city: form.city || baller.city,
      state: form.state || baller.state,
      zipcode: form.zipcode || baller.zipcode,
      phone: form.phone || baller.phone,
      type: form.type || baller.type,
      age: form.age || baller.age,
    };

    try {
      await AuthApi.updateUser(userDataUpdate);
    } catch (e) {
      onLoadingSet({
        isUpdatingUser: false,
      }, e);

      return;
    }

    try {
      const ballerInfo = await AuthApi.getUserByUser(baller.id);
      const gameView = {
        data: ballerInfo.profile,
      };

      dispatch(displayView(gameView));
    } catch (e) {
      onLoadingSet({
        isUpdatingUser: false,
      }, e);

      return;
    }

    onLoadingSet({
      isUpdatingUser: false,
    });

    onHideInner();
  };

  const getUserPermissions = async () => {
    onLoadingSet({
      isGettingPermissions: true,
    });

    try {
      const { skillsId, skillsIdDefault } = await SkillsApi.getUserPermissions(ballerId);

      currentSkills.current = skillsId;
      setSelectedSkills(skillsId);
      setDefaultSkills(skillsIdDefault);
    } catch (e) {
      onLoadingSet({
        isGettingPermissions: false,
      }, e);

      return;
    }

    onLoadingSet({
      isGettingPermissions: false,
    });
  };

  React.useEffect(() => {
    getUserPermissions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderBirthdate = () => {
    const { age: ageState } = form;
    const date = ageState || age;

    return (
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.textLabel}>Birthdate</Text>

          <DateTimePicker
            value={date}
            title="title"
            isDate
            isInputStyle
            formatDateSelected="YYYY-MM-DD"
            onChange={(dateNew) => {
              onSetForm('age', dateNew);
            }}
          />
        </View>
      </View>
    );
  };

  const renderSkills = () => (
    <View style={styles.inputContainer}>
      <Text style={styles.textLabel}>Skills</Text>

      <ListSkillsCheckbox
        dataSelected={selectedSkills}
        dataMarkDisabled={defaultSkills}
        onDataSelectedUpdate={(data) => {
          setSelectedSkills([...data]);
        }}
      />
    </View>
  );

  const renderMemberType = () => {
    let name = `unknown type ${type}`;

    const memberType = memberTypes.find(({ id }) => parseInt(id, 10) === type);

    if (memberType) {
      name = memberType.name;
    }

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.textLabel}>Member Type</Text>
        <Button
          full
          style={[formStyles.selectBtn, gs.width95p]}
          onPress={() => {
            setShowMemerTypePicker(true);
          }}
        >
          <Text
            black
            medium
            style={[gs.fS18, gs.width100p]}
          >
            {name}
          </Text>
        </Button>
      </View>
    );
  };

  const renderPicker = () => {
    if (!showMemerTypePicker) {
      return null;
    }

    return (
      <View
        style={gs.bgWhite}
      >
        <Picker
          selectedValue={type}
          style={[gs.bgWhite, gs.borderR5]}
          onValueChange={(value) => {
            onSetForm('type', value);
            setShowMemerTypePicker(false);
          }}
        >
          {memberTypes.map((value, key) => (
            <Picker.Item
              label={value.name}
              value={value.id}
              key={key.toString()}
            />
          ))}
        </Picker>
      </View>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      backdropColor="#3c3c3c"
      backdropOpacity={0.95}
      onShow={() => {
        getUserPermissions();
      }}
    >
      <SafeAreaView style={[gs.flex, gs.bgTrans]}>

        <View style={styles.modalHeader}>
          <Button
            full
            transparent
            style={styles.close}
            onPress={() => onHideInner()}
          >
            <Icon
              type="MaterialIcons"
              name="clear"
            />

            <Text
              style={[gs.flex, gs.fS28, gs.fontBold, gs.width100p, gs.colorWhite]}
            >
              SETTINGS
            </Text>
          </Button>
        </View>

        <KeyboardAvoidingView
          behavior="padding"
          style={[gs.flex, gs.width100p, gs.jCCenter, gs.aICenter]}
        >
          <ScrollView style={gs.width100p}>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.textLabel}>First Name</Text>
                <TextInput
                  onChangeText={(firstName) => onSetForm('firstName', firstName)}
                  style={styles.textInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardAppearance="dark"
                  placeholderTextColor="#000000"
                  placeholder={baller.firstName}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.textLabel}>Last Name</Text>
                <TextInput
                  onChangeText={(lastName) => onSetForm('lastName', lastName)}
                  style={styles.textInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardAppearance="dark"
                  placeholderTextColor="#000000"
                  placeholder={baller.lastName}
                />
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.textLabel}>Email Address</Text>
                <TextInput
                  onChangeText={(email) => onSetForm('email', email)}
                  style={styles.textInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardAppearance="dark"
                  placeholderTextColor="#000000"
                  placeholder={baller.email}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.textLabel}>Phone Number</Text>
                <TextInput
                  onChangeText={(phone) => onSetForm('phone', phone)}
                  style={styles.textInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardAppearance="dark"
                  placeholderTextColor="#000000"
                  placeholder={baller.phone}
                />
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.textLabel}>City</Text>
                <TextInput
                  onChangeText={(city) => onSetForm('city', city)}
                  style={[styles.textInput]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#000000"
                  underlineColorAndroid="transparent"
                  keyboardAppearance="dark"
                  placeholder={baller.city}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.textLabel}>State</Text>
                <TextInput
                  onChangeText={(state) => onSetForm('state', state)}
                  style={styles.textInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardAppearance="dark"
                  placeholderTextColor="#000000"
                  placeholder={baller.state}
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.textLabel}>Zipcode</Text>
                <TextInput
                  onChangeText={(zipcode) => onSetForm('zipcode', zipcode)}
                  style={styles.textInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardAppearance="dark"
                  placeholderTextColor="#000000"
                  placeholder={baller.zipcode}
                />
              </View>
            </View>

            {renderBirthdate()}

            {renderMemberType()}

            {renderSkills()}
          </ScrollView>

        </KeyboardAvoidingView>

        {renderPicker()}

        <Button
          full
          style={styles.updateButton}
          onPress={() => onUpdateUser()}
        >
          <Text
            style={[gs.fS22, gs.fontBold, gs.width100p, gs.textCenter, gs.colorWhite]}
          >
            SAVE
          </Text>
        </Button>

        <Spinner
          visible={isLoading}
        />
      </SafeAreaView>
    </Modal>
  );
};

ProfileSettings.propTypes = {
  onHide: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default ProfileSettings;
