import './AppFooter.css';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function AppFooter({ className }) {
  return (
    <footer className={classnames('AppFooter', className)}>
      <p className="AppFooterSection AppFooterSection--contact">
        <span className="AppFooterContactLink">
          Code by
          {' '}
          <a href="https://twitter.com/peebun" className="AnchorText TextIcon TextIcon--twitter">Dustin Boersma</a>
        </span>
      </p>
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
