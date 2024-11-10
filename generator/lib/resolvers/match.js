import { pascalCase } from "change-case";
import variableResolver from "./variable.js";

export default function (opts) {
  return {
    execute: async ({ context: mongoFilter }) => {
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
        return field.split('.').map((x, index) => index > 0 ? pascalCase(x) : x).join('.');
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
          predicateClauses.push(parseCondition("x." + pascalCase(key), value));
        }
      }

      return "x => " + predicateClauses.join(" && ");
    }
  }
}
