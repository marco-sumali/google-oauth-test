import logo from './logo.svg';
import './App.css';

import {useState, useEffect} from 'react';

function App() {
  const [code, setCode] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [isCalendarGranted, setIsCalendarGranted] = useState('')
  const {REACT_APP_GOOGLE_CLIENT_ID, REACT_APP_GOOGLE_CLIENT_SECRET} = process.env
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

  useEffect(async () => {
    const params = window.location.search
    const codeRegex = new RegExp('&code=(.*)&scope', 'i')
    const isSignedIn = codeRegex.test(params)
    if (isSignedIn){
      const code = codeRegex.exec(params)[1]
      setCode(code)

    // Google token URL to fetch access token
    const googleTokenURL = 'https://oauth2.googleapis.com/token'
    // Required data to retrive access token and refresh token
    const data = {
      code,
      client_id: REACT_APP_GOOGLE_CLIENT_ID,
      client_secret: REACT_APP_GOOGLE_CLIENT_SECRET,
      redirect_uri: window.location.origin,
      grant_type: "authorization_code",
    }
    // Options to post
    const options = {method: 'post', body: JSON.stringify(data)}

    const tokenObj = await (await fetch(googleTokenURL, options)).json()
    const {access_token, expires_in, refresh_token, token_type, scope} = tokenObj
    setAccessToken(access_token)
    setRefreshToken(refresh_token)

    const isGrantedRegex = new RegExp('https://www.googleapis.com/auth/calendar', 'i')
    const isGranted = isGrantedRegex.test(scope)
    if (isGranted) {
      setIsCalendarGranted('Yes')
    } else {
      setIsCalendarGranted('No')
    }
    console.log('token:', tokenObj)
    }
  }, [])

  const serverSignIn = async () => {
    const oauthURL = `https://accounts.google.com/o/oauth2/v2/auth`
    const responseType = 'code'
    const accessType = 'offline'
    const state = 'state_parameter_passthrough_value'
    const scope = 'https://www.googleapis.com/auth/calendar'
    const redirectURI = 'http://localhost:8080'
    const prompt = 'consent'
    const isGranted = 'true'
    const redirectOauthURL = `${oauthURL}?client_id=${REACT_APP_GOOGLE_CLIENT_ID}&response_type=${responseType}&access_type=${accessType}&state=${state}&scope=${scope}&redirect_uri=${redirectURI}&prompt=${prompt}&include_granted_scopes=${isGranted}`

    window.location.replace(redirectOauthURL)
  }

  const signOut = () => {
    const auth2 = gapi.auth2.init({
      client_id: REACT_APP_GOOGLE_CLIENT_ID,
      cookiepolicy: 'single_host_origin',
      scope: 'profile',
    });
    auth2.signOut()
  }

  const checkUser = () => {
    const auth2 = gapi.auth2.init({
      client_id: REACT_APP_GOOGLE_CLIENT_ID,
      cookiepolicy: 'single_host_origin',
      scope: 'profile',
    });
    const googleUser = auth2.currentUser.get();
    console.log('User:', googleUser)
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>Code:</div>
        <div>{code}</div>
        <div>------------------------</div>
        <div>Access Token:</div>
        <div>{accessToken}</div>
        <div>------------------------</div>
        <div>Refresh Token:</div>
        <div>{refreshToken}</div>
        <div>------------------------</div>
        <div>Calendar Access Granted:</div>
        <div>{isCalendarGranted}</div>
        <div>------------------------</div>
        <button onClick={signIn}>Google Sign In</button>
        <button onClick={signOut}>Sign Out</button>
        <button onClick={checkUser}>Check User</button>
        <button onClick={serverSignIn}>Server Google Sign In</button>
      </header>
    </div>
  );
}

export default App;
