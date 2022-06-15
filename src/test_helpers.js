
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment
} from "@firebase/rules-unit-testing";
import {
  get, set, ref, child
} from "firebase/database";

export async function createEntry(env, path, data){
  await env.withSecurityRulesDisabled(async context => {
    await context.database().ref(path).update(data);
  });
}

export async function assertEq(env, path, obj){
  await env.withSecurityRulesDisabled(async context => {
    let data = await context.database().ref(path).get();
    expect(data.val()).toEqual(obj);
  });
}

