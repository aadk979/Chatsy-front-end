//depricated and replaced with passkey_chatsy_secure.js//

function registerUser(user_email, user_name, name = 'chatsy2.web.app') {
  return new Promise((resolve, reject) => {
      if (user_email === null || user_name === null) {
          reject(new Error('User email or name is missing. Please try again.'));
          return;
      }
      if (user_name === name) {
          reject(new Error('User name is same as service name. Please try again.'));
          return;
      }
      const challenge = generate_challenge(32);
      if (challenge.length < 32) {
          reject(new Error('Challenge is not valid. Please try again.'));
          return;
      }
      navigator.credentials.create({
          publicKey: {
              challenge: Uint8Array.from(challenge, c => c.charCodeAt(0)),
              rp: { name: name },
              user: { id: new Uint8Array(16), name: user_email, displayName: user_name },
              pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
              timeout: 600000,
              attestation: 'direct'
          }
      }).then(credential => {
          const cid = btoa(String.fromCharCode.apply(null, new Uint8Array(credential.rawId)));
          resolve({ challenge: challenge , primary_id: generate_challenge(500) , standard_key: generate_challenge(600) , credential_id: cid , private: generate_challenge(900)});
      }).catch(error => {
          reject(new Error('Error registering user: ' + error.message));
      });
  });
}

function authenticateUser(challenge, credential_id) {
  return new Promise((resolve, reject) => {
      if (challenge === null || credential_id === null) {
          reject(new Error('Challenge or credential id is missing. Please try again.'));
          return;
      }

      const challengeArray = new Uint8Array(atob(challenge).split('').map(c => c.charCodeAt(0)));
      const credentialIdArray = new Uint8Array(atob(credential_id).split('').map(c => c.charCodeAt(0)));
      navigator.credentials.get({
          publicKey: {
              challenge: challengeArray,
              rpId: window.location.hostname,
              allowCredentials: [{
                  type: 'public-key',
                  id: credentialIdArray,
                  transports: ['internal']
              }],
              userVerification: 'required'
          }
      }).then(assertion => {
          if (assertion) {
              resolve(200);
          } else {
              resolve(400);
          }
      }).catch(error => {
          if (error.name === 'NotAllowedError') {
              reject(new Error('Error authenticating user: ' + error.message));
          } else {
              console.log(error);
              reject(new Error('Error authenticating user: ' + error.message));
          }
      });
  });
}

function generate_challenge(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset.charAt(randomIndex);
  }
  return randomString;
}

export { registerUser, authenticateUser, generate_challenge };