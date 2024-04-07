
function addCryptoJSScript() {
    var script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js";
    document.body.appendChild(script);
}

window.onload = function() {
    addCryptoJSScript();
};

function registerUser(user_email, user_name, name) {
    return new Promise((resolve, reject) => {
        if (user_email === null || user_name === null || user_email === undefined || user_name === undefined || user_email === '' || user_name === '') {
            reject(new Error('User email or name is missing. Please try again.'));
            return;
        }
        if (name === null || name === undefined || name === ''){
            reject(new Error('Service name is missing.'));
            return;
        }
        if (user_name === name) {
            reject(new Error('User name is same as service name. Please try again.'));
            return;
        }
        const challenge = generate_challenge(256);
        if (challenge.length < 32) {
            reject(new Error('Challenge is not valid. Please try again.'));
            return;
        }
        navigator.credentials.create({
            publicKey: {
                challenge: Uint8Array.from(challenge, c => c.charCodeAt(0)),
                rp: { name: name },
                user: { id: new Uint8Array(64), name: user_email, displayName: user_name },
                pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
                timeout: 600000,
                attestation: 'direct'
            }
        }).then(credential => {
            const secret1 = generateKey();
            const cid = btoa(String.fromCharCode.apply(null, new Uint8Array(credential.rawId)));
            encrypt_internal(cid , secret1)
                .then((cid2)=>{
                    const secret2 = generateKey();
                    encrypt_internal(challenge , secret2)
                        .then((challenge2)=>{
                            //fake data is generated for security purposes
                            const x = generateKey3(getRandomNumber());
                            const y = generateKey3(getRandomNumber());
                            const fake1  = generateKey();
                            const fake2 = generateKey();
                            const a = generateKey3(getRandomNumber());
                            const b = generateKey3(getRandomNumber());
                            const c = generateKey3(getRandomNumber());
                            const z = generateKey3(getRandomNumber())
                            const data = secret1 + x + fake1 + y + secret2 + x + fake2; 
                            resolve({ 
                                Notice: '**NOTICE: user_cred and verification_code should not be stored together. They should be stored separatley and reconstructed during authentication!**' , 
                                user_cred: {
                                    challenge: challenge2 , 
                                    x: x ,
                                    y: y , 
                                    a: a , 
                                    b: b , 
                                    c: c , 
                                    z: z , 
                                    credential_id: cid2 , 
                                    primary_id: generate_challenge(256) , 
                                    standard_key: generate_challenge(256) , 
                                    decryption_key: generateKey()
                                } , 
                                verification_code: data
                            });
                        })
                        .catch(e=>{
                            reject(new Error('Unable to return user credential , cause: challenge.'))
                        });
                })
                .catch(e=>{
                    reject(new Error('Unable to return user credential , cause: credential_id.'))
                });
        }).catch(error => {
            reject(new Error('Error registering user: ' + error.message));
        });
    });
}

function authenticateUser(data , assertion_return = false) {
    return new Promise((resolve, reject) => {
        if (data.verification_code === undefined || data.verification_code === null || data.verification_code === ''){
            reject(new Error('Missing user_cred details or Missing verification_code.'));
            return;
        }
        if (!data.user_cred){
            reject(new Error('Missing user_cred.'));
            return;
        }
        if (data.user_cred.x === '' || data.user_cred === null || data.user_cred === undefined){
            reject(new Error('Missing x , y , a , b , c or z value.'));
            return;
        }
        if (data.user_cred.y === '' || data.user_cred.y === null || data.user_cred.y === undefined){
            reject(new Error('Missing x , y , a , b , c or z value.'));
            return;
        }
        const verification_code = data.verification_code;
        const x = data.user_cred.x;
        const y = data.user_cred.y;
        const secret1 = verification_code.split(x)[0];
        const secret2 = verification_code.split(x)[1].split(y)[1];
        decrypt_internal(data.user_cred.credential_id , secret1)
            .then(credential_id =>{
                decrypt_internal(data.user_cred.challenge , secret2)
                    .then(challenge =>{
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
                                if(assertion_return){
                                    resolve(assertion);
                                    return;
                                }else if(!assertion_return){
                                    resolve(200);
                                    return;
                                }else{
                                    reject(new Error('Error returning response , expected (true or false) , got (' + assertion_return + ').'));
                                    return;
                                }
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
                    })
                    .catch(e=>{
                        reject(new Error('Unable to authenticate user , cause: (challenge failure , JSON object given was not proper).'))
                    });
        })
        .catch(e=>{
            reject(new Error('Unable to authenticate user , cause: (credential_id failure , JSON object given was not proper).'))
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

async function encrypt_internal(data , key1) {
    try{
      const plaintext = data;
      const key = key1;
      const encryptedText = await CryptoJS.AES.encrypt(plaintext, key).toString();
      return encryptedText;
    }catch(e){
      console.error(e)
    }
}

async function decrypt_internal(data , key1) {
    try{
      const key = key1;
      const encryptedText = data;
      const decryptedText = await CryptoJS.AES.decrypt(encryptedText, key).toString(CryptoJS.enc.Utf8);
      return decryptedText;
    }catch(e){
      console.error(e)
    }
}

function generateKey3(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
}

function generateKey() {
    const keyLength = 256 / 4;
    let key = '';
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < keyLength; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key
}

function getRandomNumber() {
    const randomNumber = Math.random();
    const scaledNumber = randomNumber * (20 - 5) + 5;
    const randomNumberInRange = Math.round(scaledNumber);
    return randomNumberInRange;
}

export { registerUser, authenticateUser, generateKey , encrypt_internal , decrypt_internal };