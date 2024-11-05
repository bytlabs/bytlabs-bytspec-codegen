import variableResolver from "./variableResolver.js";

export default function matchSyntaxResolver(mongoFilter) {
  const operatorsMap = {
    "$eq": "==",
    "$ne": "!=",
    "$gt": ">",
    "$gte": ">=",
    "$lt": "<",
    "$lte": "<=",
    "$in": "Contains"
  };

  function parseField(field) {
    // Convert MongoDB's dot notation (e.g., "address.city") to C# nested property access
    return field.split('.').join('.');
  }

  function parseCondition(key, condition) {
    if (typeof condition === "object" && condition !== null) {
      const expressions = [];
      for (let [operator, value] of Object.entries(condition)) {
        if (operator === "$in") {
          expressions.push(`${parseField(key)}.${operatorsMap[operator]}(${variableResolver(value)})`);
        } else if (operatorsMap[operator]) {
          expressions.push(`${parseField(key)} ${operatorsMap[operator]} ${variableResolver(value)}`);
        }
      }
      return expressions.join(" && ");
    } else {
      return `${parseField(key)} == ${variableResolver(condition)}`;
    }
  }

  function parseLogicalOperator(operator, conditions) {
    const expressions = conditions.map(condition => {
      return mongoToCSharpPredicate(condition);  // Recursively parse each condition
    });
    const csharpOperator = operator === "$or" ? " || " : " && ";
    return `(${expressions.join(csharpOperator)})`;
  }

  const predicateClauses = [];
  for (let [key, value] of Object.entries(mongoFilter)) {
    if (key === "$or" || key === "$and") {
      predicateClauses.push(parseLogicalOperator(key, value));
    } else {
      predicateClauses.push(parseCondition("x."+key, value));
    }
  }

  return "x => "+predicateClauses.join(" && ");
}

// Example usage:
// const mongoFilter = {
//   "$or": [
//     { "age": { "$gte": 18, "$lt": 30 } },
//     { "name": "Alice" },
//     { "address.city": "New York" }
//   ],
//   "$and": [
//     { "active": true },
//     { "tags": { "$in": ["developer", "designer"] } }
//   ]
// };

// const csharpPredicateExpression = `x => ${matchSyntaxResolver(mongoFilter)}`;
// console.log(csharpPredicateExpression);

// Expected output:
// x => ((x.age >= 18 && x.age < 30) || (x.name == "Alice") || (x.address.city == "New York")) && (x.active == true && x.tags.Contains(["developer","designer"]))
