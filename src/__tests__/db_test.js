import { wbDb } from '../components/wb_db';
import { initializeTestEnvironment } from "@firebase/rules-unit-testing";
import {
  get, set, ref, child
} from "firebase/database";
import { readFileSync, createWriteStream } from 'fs';


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

test('users collection access', async () => {
  expect.assertions(2);
  const env = await dbSetup();

  await env.withSecurityRulesDisabled(async context => {
    await context.database().ref('users/foobar4').set({ foo: 'bar' });
  });


  // unauthed user cannot write to users
  const unauthedDb = env.unauthenticatedContext().database();
  let e;
  try {
    await unauthedDb.ref('users/unauth').set({bar:true});
  }catch(_e){
    //expect an error
    e = _e;
  }
  expect(e.toString()).toBe('Error: PERMISSION_DENIED: Permission denied');

  // user should be able to write to their own path
  const authedDb = env.authenticatedContext('bob').database();
  await authedDb.ref('users/bob').update({bar:true});
  // If it didn't throw an exception then we're good

  // user should not be able to write to others paths
  try {
    await authedDb.ref('users/sally').set({bar:true});
  }catch(_e){
    //expect an error
    e = _e;
  }
  expect(e.toString()).toBe('Error: PERMISSION_DENIED: Permission denied');
});
