// validate field from request
exports.validateField = (value, data) => {
  // check if the value parameter is null or undefined
  if (data[`${value}`] === null || data[`${value}`] === undefined) {
    throw new Error(`${value} is required.`)
  }
  if (value === 'rule') {
    // checks if the value param is a valid object
    if (typeof data[`${value}`] !== 'object') {
      throw new Error(`${value} should be an object.`)
    }
  }
  return true
}

// validate rule data
exports.validateRuleData = (data) => {
  // makes sure the rule object contains all the required fields
  let fields = ['field', 'condition', 'condition_value']
  for (let index = 0; index < fields.length; index++) {
    const element = fields[index];
    if (data[`${element}`] === null || data[`${element}`] === undefined) {
      throw new Error(`field ${element} is missing from rule.`)
    }
  }
  return true
}

// check rule specified field validation
exports.validateSpecifiedField = (rule, data) => {
  // caputes the level stated in the rule field 
  let doubleLevel = rule.field.includes('.')
  if (!doubleLevel) {
    // validate for only one level 
    if (data[`${rule.field}`] === null || data[`${rule.field}`] === undefined) {
      throw new Error(`field ${rule.field} is missing from data.`)
    }
  } else {
    // gets both levels in the rule field
    let splitLevels = rule.field.split('.')
    let levelOne = splitLevels[0]
    let levelTwo = splitLevels[1]

    // validate for level one, checks if its not null or undefined
    if (data[`${levelOne}`] === null || data[`${levelOne}`] === undefined) {
      throw new Error(`field ${levelOne} is missing from data.`)
    }

    // validate for level two, checks if its not null or undefined
    if (data[`${levelOne}`][`${levelTwo}`] === null || data[`${levelOne}`][`${levelTwo}`] === undefined) {
      throw new Error(`field ${levelTwo} is missing from ${levelOne} in data.`)
    }
  }
  return true
}

// runs evaluation based on the rule condition
exports.runEvaluation = (rule, data) => {
  let doubleLevel = rule.field.includes('.')
  let splitLevels = rule.field.split('.')
  let levelOne = splitLevels[0]
  let levelTwo = splitLevels[1]

  let result
  switch (rule.condition) {
    case 'eq':
      result = !doubleLevel ?
        data[`${rule.field}`] === rule.condition_value
        :
        data[`${levelOne}`][`${levelTwo}`] === rule.condition_value
      break;
    case 'neq':
      result = !doubleLevel ?
        data[`${rule.field}`] !== rule.condition_value
        :
        data[`${levelOne}`][`${levelTwo}`] !== rule.condition_value
      break;
    case 'gt':
      result = !doubleLevel ?
        data[`${rule.field}`] > rule.condition_value
        :
        data[`${levelOne}`][`${levelTwo}`] > rule.condition_value
      break;
    case 'gte':
      result = !doubleLevel ?
        data[`${rule.field}`] >= rule.condition_value
        :
        data[`${levelOne}`][`${levelTwo}`] >= rule.condition_value
      break;
    case 'contains':
      result = !doubleLevel ?
        data[`${rule.field}`].toLowerCase().includes(rule.condition_value.toLowerCase())
        :
        data[`${levelOne}`][`${levelTwo}`].toLowerCase().includes(rule.condition_value.toLowerCase())
      break;

    default:
      result = false
  }
  return result
}



