import React from 'react';
import Button from '@material-ui/core/Button';
import './login.css';

const Login = ({ onGoogleLogin }) => {
  return (
    <div className="login">
      <div className="login__section">
        <img src="https://cdn2.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-whatsapp-circle-512.png" />
        <Button variant="outlined" className="text-white button-outline-white"
          onClick={onGoogleLogin}
        >
          Login With Google
        </Button>
      </div>
    </div>
  )
}

export default Login;
