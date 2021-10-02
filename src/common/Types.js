
import PropTypes from 'prop-types';

export const StyleType = PropTypes.oneOfType([
  PropTypes.object,
  PropTypes.array,
]);

export const ImageSource = PropTypes.oneOfType([
  PropTypes.shape({
    uri: PropTypes.string,
    headers: PropTypes.objectOf(PropTypes.string),
  }),
  PropTypes.number,
  PropTypes.arrayOf(
    PropTypes.shape({
      uri: PropTypes.string,
      width: PropTypes.number,
      height: PropTypes.number,
      headers: PropTypes.objectOf(PropTypes.string),
    }),
  ),
]);

export const Children = PropTypes.oneOfType([
  PropTypes.elementType,
  PropTypes.element,
  PropTypes.node,
]);
