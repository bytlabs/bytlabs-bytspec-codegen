function matchSyntaxResolver(mongoFilter) {
    const operatorsMap = {
      "$gt": ">",
      "$gte": ">=",
      "$lt": "<",
      "$lte": "<=",
      "$in": "Contains"
    };
  
    function parseField(field) {
      // Convert MongoDB's dot notation (e.g., "address.city") to C# nested access (e.g., "address.city")
      return field.split('.').join('.');
    }
  
    function parseCondition(key, condition) {
      if (typeof condition === "object" && condition !== null) {
        const expressions = [];
        for (let [operator, value] of Object.entries(condition)) {
          if (operator === "$in") {
            expressions.push(`${parseField(key)}.${operatorsMap[operator]}(${JSON.stringify(value)})`);
          } else if (operatorsMap[operator]) {
            expressions.push(`${parseField(key)} ${operatorsMap[operator]} ${JSON.stringify(value)}`);
          }
        }
        return expressions.join(" && ");
      } else {
        // Simple equality check
        return `${parseField(key)} == ${JSON.stringify(condition)}`;
      }
    }
  
    function parseLogicalOperator(operator, conditions) {
      const expressions = conditions.map(condition => {
        return mongoToCSharpWhere(condition);  // Recursively parse each condition
      });
      const csharpOperator = operator === "$or" ? " || " : " && ";
      return `(${expressions.join(csharpOperator)})`;
    }
  
    const whereClauses = [];
    for (let [key, value] of Object.entries(mongoFilter)) {
      if (key === "$or" || key === "$and") {
        whereClauses.push(parseLogicalOperator(key, value));
      } else {
        whereClauses.push(parseCondition(key, value));
      }
    }
  
    return whereClauses.join(" && ");
  }
  
  
export default matchSyntaxResolver;

// Example usage:
// const mongoFilter = {
//     "$or": [
//       { "age": { "$gte": 18, "$lt": 30 } },
//       { "name": "Alice" },
//       { "address.city": "New York" }
//     ],
//     "$and": [
//       { "active": true },
//       { "tags": { "$in": ["developer", "designer"] } }
//     ]
//   };
  
//   const csharpWhereExpression = matchSyntaxResolver(mongoFilter);
//   console.log(csharpWhereExpression);