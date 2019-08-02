import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useReturnQuery, API_BASE, processIfNotEmptyOrNil } from "utility";

import { Link as RouterLink } from "components/Router";
import Icon from "components/Icon";
import { Button } from "react-bootstrap";

import "./style.scss";

export function useOauthUrl() {
  const returnQuery = useReturnQuery();
  return `${API_BASE}/login${processIfNotEmptyOrNil(
    returnQuery,
    q => `?${q}`
  )}`;
}

function LoginButton({ loggedIn }) {
  const oauthUrl = useOauthUrl();
  return loggedIn ? (
    <div>
      <p className="mb-3">You are already logged in</p>
      <Button to="/app" as={RouterLink}>
        Get started
      </Button>
    </div>
  ) : (
    <div>
      <p>Sign in to add architus to a server.</p>
      <Button variant="discord" href={oauthUrl} className="login">
        <Icon name="discord" />
        <span>Connect</span> <span> with Discord</span>
      </Button>
    </div>
  );
}

LoginButton.propTypes = {
  loggedIn: PropTypes.bool
};

LoginButton.displayName = "LoginButton";

function ConnectedLoginButton() {
  const loggedIn = useSelector(state => state.session.connectedToDiscord);
  return <LoginButton loggedIn={loggedIn} />;
}

export default ConnectedLoginButton;

ConnectedLoginButton.Inner = LoginButton;
ConnectedLoginButton.displayName = "ConnectedLoginButton";
