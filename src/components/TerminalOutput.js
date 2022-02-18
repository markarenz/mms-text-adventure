import React from 'react';
import PropTypes from 'prop-types';

const TerminalOutput = ({ stdOutput, soEof }) => (
  <div className="terminalOutputWrap">
    <label>» Terminal Output</label>
    <div className="terminalOutput">
      <div
        className="terminalOutputContent"
        dangerouslySetInnerHTML={{ __html: stdOutput }}
      />
      <div ref={soEof} className="terminalOutputEof">
        EOF
      </div>
    </div>
  </div>
);

TerminalOutput.propTypes = {
  stdOutput: PropTypes.string.isRequired,
  soEof: PropTypes.objectOf(PropTypes.any),
};

export default TerminalOutput;
