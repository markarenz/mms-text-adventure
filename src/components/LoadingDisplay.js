import Cassette from './Cassette';
import PropTypes from 'prop-types';

const LoadingDisplay = ({ mode }) => {
  return (
    <div className="LoadingDisplay">
      <Cassette mode={mode} />
    </div>
  );
};
LoadingDisplay.propTypes = {
  mode: PropTypes.string.isRequired,
};

export default LoadingDisplay;
