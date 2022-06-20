import {wbDb} from './wb_db'
import {createEntry, assertEq} from '../test_helpers';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment
} from "@firebase/rules-unit-testing";
import {
  get, set, ref, child
} from "firebase/database";
import { readFileSync, createWriteStream } from 'fs';


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


async function createUser(env, id){

  await createEntry(
    env,
    `users/${id}`,
    {
      name:'name'
    }
  );
}

async function envSetup(){
  const env = await initializeTestEnvironment({
    projectId: 'wbfest',
    database: {
      host: 'localhost',
      port: 9000,
      rules: readFileSync('./db/database.rules.json', 'utf8')
    },
  });

  return env;
}

function setup(cb){
  let db = new wbDb(firebaseConfig, {local:true, authCallBack:cb});
  return db;
}

it('should auth', done => {
  const db = setup(async profile =>{
    // This is the callback that is called on successful auth
    expect(profile).not.toBeNull();
    await db.signOut();
    done(); // you have to call this to signal the test is over or it will time out
  });
  db.signIn();

});

it('should add friend', async () => {
  console.log('start test');
  let friendId = 'friend';
  //create user1
  //sign in as user2
  const env = await envSetup();
  await createUser(env, friendId);
  console.log('created user');

  let p = new Promise((resolve, reject) => {
    const db = setup(async profile =>{
      // This is the callback that is called on successful auth
      console.log('got callback');
      //add user1 as friend
      let ret = await db.addFriendWithId(friendId);
      expect(ret).toEqual({name:'name'})

      resolve();
    });
    console.log('signing in');
    db.signIn();
  });

  return p;

});


//TODO: DONE addFriend,
//      try to add friend that doesn't exist
//      create new user,
//      getFriends,
//      don't add self as friend
//      finish game
//      update name
