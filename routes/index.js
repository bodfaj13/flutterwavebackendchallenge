var express = require('express');
var router = express.Router();
const utils = require('../utils/index')

const {
  validateField,
  validateRuleData,
  validateSpecifiedField,
  runEvaluation
} = utils

// Task one
router.get('/', function (req, res, next) {
  res.status(200).json({
    message: 'My Rule-Validation API.',
    status: 'success',
    data: {
      name: 'Bello Ajibola',
      github: '@bodfaj13',
      email: 'bellohargbola13@gmail.com',
      mobile: '07034846894',
      twitter: '@ppt_link'
    }
  })
});

// Task two
router.post('/validate-rule', function (req, res, next) {
  const { rule, data } = req.body
  try {
    // check rule validation
    let checkRule = validateField('rule', req.body)

    // check data validation
    let checkData = validateField('data', req.body)

    // check rule data validation
    let checkRuleData = validateRuleData(rule)

    // check rule specified field validation
    let checkSpecifiedField = validateSpecifiedField(rule, data)

    // get evaluation result
    let evaluation = runEvaluation(rule, data)

    // send out response based on evaluation
    if (evaluation) {
      res.status(200).json({
        message: `field ${rule.field} successfully validated.`,
        status: 'success',
        data: {
          error: false,
          field: rule.field,
          field_value: data[`${rule.field}`],
          condition: rule.condition,
          condition_value: rule.condition_value
        }
      })
    } else {
      res.status(200).json({
        message: `field ${rule.field} failed validation.`,
        status: 'error',
        data: {
          error: true,
          field: rule.field,
          field_value: data[`${rule.field}`],
          condition: rule.condition,
          condition_value: rule.condition_value
        }
      })
    }

  } catch (error) {
    // catch and send out any validation error
    res.status(400).json({
      message: error.message,
      status: 'error',
      data: null
    })
  }
});

module.exports = router;
