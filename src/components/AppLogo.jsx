import './AppLogo.css';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function AppLogo({ className }) {
  return (
    <div className={classnames('AppLogo', className)}>
      <h1 className="AppLogo-title">folklore labs</h1>
    </div>
  );
}

AppLogo.defaultProps = {
  className: '',
};

AppLogo.propTypes = {
  className: PropTypes.string,
};

export default AppLogo;
