import { wbDb } from '../components/wb_db';
import { initializeTestEnvironment } from "@firebase/rules-unit-testing";
import {
  get, set, ref, child
} from "firebase/database";
import { readFileSync, createWriteStream } from 'fs';


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
  return new wbDb(firebaseConfig, {local:true, authCallBack:cb});

}

async function dbSetup(){
  const env = await initializeTestEnvironment({
    projectId: 'wbtest2',
    database: {
      host: 'localhost',
      port: 9000,
      rules: readFileSync('./db/database.rules.json', 'utf8')
    },
  });
  env.clearDatabase();
  return env;
}

it('should exist', () => {
  const db = setup();
  expect(true).toBeTruthy();
});

it('should auth', done => {
  const db = setup(profile =>{
    // This is the callback that is called on successful auth
    expect(true).toBeTruthy();
    expect(profile).not.toBeNull();
    done(); // you have to call this to signal the test is over or it will time out
  });

  db.signIn();
});

it('basic db', async () => {
  expect.assertions(1);
  const env = await dbSetup();

  await env.withSecurityRulesDisabled(async context => {
    await context.database().ref('users/foobar4').set({ foo: 'bar' });
  });

  const unauthedDb = env.unauthenticatedContext().database();
  // We should not be able to write this
  try {
    await unauthedDb.ref('users/unauth').set({bar:true});
  }catch(e){
    expect(e.toString()).toBe('Error: PERMISSION_DENIED: Permission denied');
  }

  const authedDb = env.authenticatedContext('bob').database();
  // We should be able to write this
  await authedDb.ref('users/bob').update({bar:true});
  // If it didn't throw an exception then we're good
});
