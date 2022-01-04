import PropTypes from 'prop-types';

const AppHeader = ({ gameName, numTurns }) => (
  <div className="mainHeader">
    <div className="left">{gameName || 'Select Game'}</div>
    <div className="right">{!!gameName && `Turn: ${numTurns}`}</div>
  </div>
);
AppHeader.propTypes = {
  gameName: PropTypes.string,
  numTurns: PropTypes.number,
};
export default AppHeader;
