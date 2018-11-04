const express = require('express');
const ContractController = require('./contractController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');
const { permissionAccess } = require('../../middlewares/permissionAccess');
const { USER } = require('../../config/constants');

const router = express.Router();

router
  .use(permissionAccess(USER))
  .post('/contracts', catchAsyncError(ContractController.addContract))
  .get('/contracts', catchAsyncError(ContractController.allContracts))
  .patch('/contracts/:id', catchAsyncError(ContractController.cancelContract))
  .get('/contracts/:id', catchAsyncError(ContractController.oneContract))
  .put('/contracts/:id', catchAsyncError(ContractController.editContract));

module.exports = router;
