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
  return (
    <div className="App">
      <header className="App-header">
        <div>Code:</div>
        <div>{code}</div>
        <button onClick={signIn}>Google Sign In</button>
      </header>
    </div>
  );
}

export default App;
