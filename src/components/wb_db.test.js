import {wbDb} from './wb_db'

const firebaseConfig = {
  apiKey: 'key',
  authDomain: 'domain',
  projectId:'wordbird-dbtest',
  storageBucket: 'bucket',
  messagingSenderId: 'id',
  appId: 'appId',
  measurementId: 'measurementid',
  databaseURL: 'https://wbfest.firebaseio.com' //This is what determines the name of the db.. for some reason
};


function createUser(id){
}

function setup(cb){
  let db = new wbDb(firebaseConfig, {local:true, authCallBack:cb});
  return db;
}

it('should exist', () => {
  const db = setup();
  expect(true).toBeTruthy();
  db.signIn();
});

it('should auth', done => {
  const db = setup(profile =>{
    // This is the callback that is called on successful auth
    expect(profile).not.toBeNull();
    done(); // you have to call this to signal the test is over or it will time out
  });
  db.signIn();
});


//it('should add friend', done => {
//  let friendId = 'friend';
//  //create user1
//  //sign in as user2
//  const db = setup(profile =>{
//    // This is the callback that is called on successful auth
//    //add user1 as friend

//    db.addFriendWithId(friendId);


//    done(); // you have to call this to signal the test is over or it will time out
//  });
//  db.signIn();

//});


//TODO: addFriend,
//      create new user,
//      getFriends,
//      don't add self as friend
//      finish game
//      update name
