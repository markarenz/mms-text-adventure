import React from 'react';
import PropTypes from 'prop-types';

const TerminalInput = ({
  inputBuffer,
  handleInputSubmit,
  handleInputChange,
  terminalInputRef,
}) => (
  <div className="terminalInputWrap">
    <label>» Type Your Commands Here</label>
    <form onSubmit={handleInputSubmit}>
      <input
        className="terminalInput"
        name="userInput"
        value={inputBuffer}
        onChange={handleInputChange}
        autoFocus
        autoComplete="off"
        ref={terminalInputRef}
      />
    </form>
  </div>
);

TerminalInput.propTypes = {
  inputBuffer: PropTypes.string,
  handleInputSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  terminalInputRef: PropTypes.objectOf(PropTypes.any),
};

export default TerminalInput;
