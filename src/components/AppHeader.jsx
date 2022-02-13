import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './AppHeader.css';

function AppHeader({ className }) {
  return (
    <header className={classnames('AppHeader', className)}>
      <Link className="AppHeader-logo" to="/">
        <h1 className="AppHeader-headline">Wallet Generator</h1>
      </Link>
    </header>
  );
}

AppHeader.defaultProps = {
  className: '',
};

AppHeader.propTypes = {
  className: PropTypes.string,
};

export default AppHeader;
