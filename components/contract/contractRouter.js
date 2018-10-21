const express = require('express');
const ContractController = require('./contractController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');
const { permissionAccess } = require('../../middlewares/permissionAccess');

const router = express.Router();

router
  .post('/contracts', permissionAccess('User'), catchAsyncError(ContractController.addContract))
  .get('/contracts', permissionAccess('User'), catchAsyncError(ContractController.allContracts))
  .patch('/contracts/:id', permissionAccess('User'), catchAsyncError(ContractController.cancelContract))
  .get('/contracts/:id', permissionAccess('User'), catchAsyncError(ContractController.oneContract))
  .put('/contracts/:id', permissionAccess('User'), catchAsyncError(ContractController.editContract));

module.exports = router;
