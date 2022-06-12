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

async function assertEq(env, path, obj){
  await env.withSecurityRulesDisabled(async context => {
    let data = await context.database().ref(path).get();
    expect(data.val()).toEqual(obj);
  });
}

async function createEntry(env, path, data){
  await env.withSecurityRulesDisabled(async context => {
    await context.database().ref(path).set(data);
  });
}


test('users collection access', async () => {
  const env = await dbSetup();

  // unauthed user cannot write to users
  const unauthedDb = env.unauthenticatedContext().database();
  await assertFails(unauthedDb.ref('users/unauth').set({bar:true}));

  // user should be able to write to their own path
  const authedDb = env.authenticatedContext('bob').database();
  await assertSucceeds(authedDb.ref('users/bob').update({bar:true}));

  // Test that the data is there
  await assertEq(env, 'users/bob', {bar:true})

  // user should not be able to write to others paths
  // TODO: test other paths?
    await assertFails(authedDb.ref('users/sally').set({bar:true}));
});

test('write to followsUser collection', async() => {
  const env = await dbSetup();

  let path = 'followsUser/user1';
  let userId = 'bob'

  //create an entry for user1 with a follower user2
  await createEntry(env, path, {user2:0});

  //auth as userId
  const authedDb = env.authenticatedContext(userId).database();

  //should be able to set self as follower of another user
  let packet = {};
  packet[userId] = 0;
  await assertSucceeds(authedDb.ref(path).update(packet));

  assertEq(env, path, {
    user2:0,
    userId:0
  });

  //should not be able to write anything else as a follower

  packet = {baz:0}
  await assertFails(authedDb.ref(path).update(packet));

});
