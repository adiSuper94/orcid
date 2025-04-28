import { getEducationSummary, getEmployment } from "./mod.ts";
import { assertEquals, fail } from "@std/assert";

Deno.test("Employment Summary: Azra", async function addTest() {
  const [emps, err] = await getEmployment("0000-0002-5745-2863");
  if (err) {
    fail(`Got error: ${JSON.stringify(err, null, 1)}`);
  }
  assertEquals(emps.length, 6);
});

Deno.test("Employment Summary: Aditya", async function addTest() {
  const [emps, err] = await getEmployment("0009-0004-9900-1472");
  if (err) {
    fail(`Got error: ${JSON.stringify(err, null, 1)}`);
  }
  assertEquals(emps.length, 1);
});

Deno.test("Education Summary: Azra", async function addTest() {
  const [edus, err] = await getEducationSummary("0000-0002-5745-2863");
  if (err) {
    fail(`Got error: ${JSON.stringify(err, null, 1)}`);
  }
  assertEquals(edus.length, 5);
});

Deno.test("Education Summary: Aditya", async function addTest() {
  const [edus, err] = await getEducationSummary("0009-0004-9900-1472");
  if (err) {
    fail(`Got error: ${JSON.stringify(err, null, 1)}`);
  }
  assertEquals(edus.length, 0);
});
