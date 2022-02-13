import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import AppLogo from './AppLogo';

import './AppFooter.css';

function AppFooter({ className }) {
  return (
    <footer className={classnames('AppFooter', className)}>
      <div className="AppFooterSection AppFooterSection--contact">
        <span className="AppFooterContactLabel">An app by</span>
        <a className="AppFooterContactLink AppFooterContactLink--img" href="/">
          <AppLogo className="AppFooter-logo" />
        </a>
      </div>
    </footer>
  );
}

AppFooter.defaultProps = {
  className: '',
};

AppFooter.propTypes = {
  className: PropTypes.string,
};

export default AppFooter;
