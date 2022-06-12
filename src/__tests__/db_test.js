import { wbDb } from '../components/wb_db';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment
} from "@firebase/rules-unit-testing";
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
  const env = await dbSetup();

  // await env.withSecurityRulesDisabled(async context => {
  //   await context.database().ref('users/foobar4').set({ foo: 'bar' });
  // });

  // unauthed user cannot write to users
  const unauthedDb = env.unauthenticatedContext().database();
  await assertFails(unauthedDb.ref('users/unauth').set({bar:true}));

  // user should be able to write to their own path
  const authedDb = env.authenticatedContext('bob').database();
  await assertFails(authedDb.ref('users/bob').update({bar:true}));
  // If it didn't throw an exception then we're good

  // Test that the data is there
  // await env.withSecurityRulesDisabled(async context => {
  //   await context.database().ref('users/bob').set({ foo: 'bar' });
  // });

  // user should not be able to write to others paths
  // TODO: test other paths?
    await assertFails(authedDb.ref('users/sally').set({bar:true}));
});

//test('write to followsUser collection'), async() => {
//  expect.assertions(2);
//  const env = await dbSetup();

//  let path = 'followsUser/user1';
//  let userId = 'bob'

//  //create an entry for user1 with a follower user2
//  await env.withSecurityRulesDisabled(async context => {
//    await context.database().ref(path).set({ user2: 0 });
//  });

//  const authedDb = env.authenticatedContext(userId).database();

//  //should be able to set self as follower of another user
//  let packet = {};
//  packet[userId] = 0;
//  await authedDb.ref(path).update(packet);

//}
