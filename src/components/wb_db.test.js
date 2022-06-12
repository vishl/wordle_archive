import {wbDb} from './wb_db'

const firebaseConfig = {
  apiKey: 'key',
  authDomain: 'domain',
  projectId:'wordbird-674fc',
  storageBucket: 'bucket',
  messagingSenderId: 'id',
  appId: 'appId',
  measurementId: 'measurementid',
  databaseURL: 'https://wbtest.firebaseio.com'
};


function setup(cb){
  let db = new wbDb(firebaseConfig, {local:true, authCallBack:cb});
  return db;
}

it('should exist', () => {
  const db = setup();
  expect(true).toBeTruthy();
});

it('should auth', done => {
  console.log('test start');
  const db = setup(profile =>{
    console.log('got callback');
    // This is the callback that is called on successful auth
    expect(true).toBeTruthy();
    expect(profile).not.toBeNull();
    done(); // you have to call this to signal the test is over or it will time out
  });

  db.signIn();
});

