import logo from './logo.svg';
import './App.css';

import {useState} from 'react';

function App() {
  const [code, setCode] = useState('')
  const {REACT_APP_GOOGLE_CLIENT_ID} = process.env
  const gapi = window.gapi  

  const signIn = () => {
    const auth2 = gapi.auth2.init({
      client_id: REACT_APP_GOOGLE_CLIENT_ID,
      cookiepolicy: 'single_host_origin',
      scope: 'profile',
    });
    const googleUser = auth2.currentUser.get();
    googleUser.grantOfflineAccess({scope: 'https://www.googleapis.com/auth/calendar', prompt: 'consent'}).then(
      function(res){
        console.log('Success:', res);
        setCode(res.code)
      },
      function(err){
        console.log('ERROR:', err);
      });
  }

  const serverSignIn = async () => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?
      client_id=${REACT_APP_GOOGLE_CLIENT_ID}&
      response_type=code&
      state=state_parameter_passthrough_value&
      scope=https://www.googleapis.com/auth/calendar&
      redirect_uri=http://localhost:8080&
      prompt=consent&
      include_granted_scopes=true`

    const res = await fetch(url, {method: 'GET'})
    console.log('check:', res)
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>Code:</div>
        <div>{code}</div>
        <button onClick={signIn}>Google Sign In</button>
        <button onClick={serverSignIn}>Server Google Sign In</button>
      </header>
    </div>
  );
}

export default App;
