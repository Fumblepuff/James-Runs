
import {
  StyleProp,
  ViewStyle,
} from 'react-native';

import {
  DropdownListData,
} from 'src/Components/DropdownList';
import {
  InputFakePropTypes,
} from 'src/Components/InputFake';

import {
  ExtractOptionalToRequiredTypes,
  AllRequiredTypes,
} from 'src/Common/Types';

export type ModalDwondownListData = DropdownListData;

export interface ModalDropdownPropTypes {
  disabled?: boolean,
  multipleSelect?: boolean,
  scrollEnabled?: boolean,
  defaultIndex?: number,
  defaultValue?: string,
  selectedValue?: string | null,
  selectedIndex?: number | null,
  options: ModalDwondownListData[],
  accessible?: boolean,
  animated?: boolean,
  showsVerticalScrollIndicator?: boolean,
  style?: StyleProp<ViewStyle>,
  dropdownStyle?: StyleProp<ViewStyle>,
  textButtonContainerStyle?: StyleProp<ViewStyle>,
  renderRow?: ((a: any) => void) | null,
  renderButtonText?: ((e: any) => string) | null,
  onDropdownWillShow?: (() => boolean) | null,
  onDropdownWillHide?: (() => boolean) | null,
  onSelect?: ((item: ModalDwondownListData, index: number) => boolean) | null,
  inputProps?: Partial<InputFakePropTypes>,
  filterOptions?: ((inputSearch: string, options: ModalDwondownListData[]) => ModalDwondownListData[]) | null,
  hasSearch?: boolean,
  renderButton?: (() => React.ReactNode) | null,
  isTypeViewTwo?: boolean,
  isTypeViewThree?: boolean,
  positionTopFix?: number,
}

export type ModalDropdownPropTypesReq = AllRequiredTypes<ModalDropdownPropTypes>;
export type ModalDropdownPropTypesOpt = ExtractOptionalToRequiredTypes<ModalDropdownPropTypes>;

export interface ModalDropdownStateTypes {
  // accessible: boolean,
  loading: boolean,
  showDropdown: boolean,
  buttonText: string,
  selectedIndex: number,
  inputSearch: string,
}
