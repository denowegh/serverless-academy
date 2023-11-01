const endpoints = [
  "https://jsonbase.com/sls-team/json-793",
  "https://jsonbase.com/sls-team/json-955",
  "https://jsonbase.com/sls-team/json-231",
  "https://jsonbase.com/sls-team/json-931",
  "https://jsonbase.com/sls-team/json-93",
  "https://jsonbase.com/sls-team/json-342",
  "https://jsonbase.com/sls-team/json-770",
  "https://jsonbase.com/sls-team/json-491",
  "https://jsonbase.com/sls-team/json-281",
  "https://jsonbase.com/sls-team/json-718",
  "https://jsonbase.com/sls-team/json-310",
  "https://jsonbase.com/sls-team/json-806",
  "https://jsonbase.com/sls-team/json-469",
  "https://jsonbase.com/sls-team/json-258",
  "https://jsonbase.com/sls-team/json-516",
  "https://jsonbase.com/sls-team/json-79",
  "https://jsonbase.com/sls-team/json-706",
  "https://jsonbase.com/sls-team/json-521",
  "https://jsonbase.com/sls-team/json-350",
  "https://jsonbase.com/sls-team/json-64",
];

function findProperty(obj) {
  var regex = new RegExp('"isDone":(.*?)(,|})');
  var jsonStr = JSON.stringify(obj);
  var match = regex.exec(jsonStr);

  if (match && match[1] !== undefined) {
    var valueStr = match[1];
    var result = JSON.parse(valueStr);
    return result;
  }

  return undefined;
}

let foundTrueValues = 0;

async function queryEndpoint(endpoint, retries = 3) {
  try {
    const response = await fetch(endpoint);

    if (response.ok) {
      const data = await response.json();
      const isDone = findProperty(data);
      if (isDone) foundTrueValues++;

      console.log(
        `[Success] ${endpoint}: isDone - ${isDone ? "True" : "False"}`
      );
    } else {
      throw new Error(response.status);
    }
  } catch (error) {
    if (retries > 0) {
      await queryEndpoint(endpoint, retries - 1);
    } else {
      console.error(`[Fail] ${endpoint}: The endpoint is unavailable`);
    }
  }
}

async function queryAllEndpoints() {
  for (const endpoint of endpoints) {
    await queryEndpoint(endpoint);
  }
  console.log(`\nFound True values: ${foundTrueValues},`);
  console.log(
    `Found False values: ${foundTrueValues ? 20 - foundTrueValues : 0}`
  );
}

await queryAllEndpoints();

// let respounse;
// async function fetchData() {
//   const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
//   respounse = await res.json();
// }

// await fetchData();
// console.log(findProperty(respounse, "id"));
