const { Contract } = require('../../models');
const error = require('../../middlewares/errorHandling/errorConstants');

/**
 * @api {post} /contracts Add new contract
 * @apiVersion 1.0.0
 * @apiName addContract
 * @apiDescription Add new contract
 * @apiGroup Contract
 *
 * @apiParam (body) {String} title Contract title
 * @apiParam (body) {String} companyName Contract company name
 * @apiParam (body) {Number} yearlyPrice Contract yearly price
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
  {
    "cancelled": false,
    "_id": "5bccbc60ae14fc1f4178d8ba",
    "title": "This is a contract title",
    "companyName": "HolyCode",
    "yearlyPrice": 2000,
    "createdBy": "5bcc565c915d5d15e6378db3",
    "createdAt": "2018-10-21T17:50:24.489Z",
    "updatedAt": "2018-10-21T17:50:24.489Z",
    "__v": 0
  }
 * @apiUse MissingParamsError
 */
module.exports.addContract = async (req, res) => {
  const { title, companyName, yearlyPrice } = req.body;

  if (!title || !companyName || !yearlyPrice) {
    throw new Error(error.MISSING_PARAMETERS);
  }
  const contract = await new Contract({ title, companyName, yearlyPrice, createdBy: req.user._id }).save();

  return res.status(201).send(contract);
};

/**
 * @api {put} /contracts/:id Edit contract
 * @apiVersion 1.0.0
 * @apiName editContract
 * @apiDescription Update contract
 * @apiGroup Contract
 *
 * @apiParam (params) {String} id Contract Mongo _id
 * @apiParam (body) {String} [title] Contract title
 * @apiParam (body) {String} [companyName] Contract company name
 * @apiParam (body) {Number} [yearlyPrice] Contract yearly price
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
  {
    "cancelled": false,
    "_id": "5bccbc60ae14fc1f4178d8ba",
    "title": "This is a new title",
    "companyName": "HolyCode",
    "yearlyPrice": 2000,
    "createdBy": "5bcc565c915d5d15e6378db3",
    "createdAt": "2018-10-21T17:50:24.489Z",
    "updatedAt": "2018-10-21T17:51:02.445Z",
    "__v": 0
  }
 * @apiUse MissingParamsError
 * @apiUse Forbidden
 */

module.exports.editContract = async (req, res) => {
  const { title, companyName, yearlyPrice } = req.body;
  const { id: _id } = req.params;

  if (!title && !companyName && !yearlyPrice) {
    throw new Error(error.MISSING_PARAMETERS);
  }
  const query = {};

  if (title) {
    query.title = title;
  }
  if (companyName) {
    query.companyName = companyName;
  }
  if (yearlyPrice) {
    query.yearlyPrice = yearlyPrice;
  }

  const results = await Contract.findOneAndUpdate(
    { _id, createdBy: req.user._id },
    { $set: query },
    { new: true }).lean();

  if (!results) {
    throw new Error(error.FORBIDDEN);
  }

  return res.status(200).send(results);
};

/**
 * @api {get} /contracts/:id Get one contract
 * @apiVersion 1.0.0
 * @apiName oneContract
 * @apiDescription Get one contract
 * @apiGroup Contract
 *
 * @apiParam (params) {String} id Contract Mongo _id
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
  {
    "_id": "5bccbc60ae14fc1f4178d8ba",
    "canceled": false,
    "title": "This is a new title",
    "companyName": "HolyCode",
    "yearlyPrice": 2000,
    "createdBy": "5bcc565c915d5d15e6378db3",
    "createdAt": "2018-10-21T17:50:24.489Z",
    "updatedAt": "2018-10-21T17:51:02.445Z",
    "__v": 0
  }
 * @apiUse NotFound
 */

module.exports.oneContract = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: createdBy } = req.user;

  const contract = await Contract.findOne({ _id, createdBy }).lean();

  if (!contract) {
    throw new Error(error.NOT_FOUND);
  }

  return res.status(200).send(contract);
};

/**
 * @api {get} /contracts Get all contracts
 * @apiVersion 1.0.0
 * @apiName allContracts
 * @apiDescription Get all contracts
 * @apiGroup Contract
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
  [
    {
      "_id": "5bccd4f0e821e225fb319a01",
      "cancelled": false,
      "title": "This is a second contract",
      "companyName": "HolyCode",
      "yearlyPrice": 1500,
      "createdBy": "5bcc565c915d5d15e6378db3",
      "createdAt": "2018-10-21T19:35:12.172Z",
      "updatedAt": "2018-10-21T19:35:12.172Z",
      "__v": 0
    },
    {
      "_id": "5bccd54fe821e225fb319a03",
      "cancelled": false,
      "title": "This is a third contract",
      "companyName": "HolyCode",
      "yearlyPrice": 4000,
      "createdBy": "5bcc565c915d5d15e6378db3",
      "createdAt": "2018-10-21T19:36:47.347Z",
      "updatedAt": "2018-10-21T19:36:47.347Z",
      "__v": 0
    }
  ]
 */

module.exports.allContracts = async (req, res) => {
  const { _id } = req.user;

  const contracts = await Contract.find({ createdBy: _id, cancelled: false }).lean();

  return res.status(200).send(contracts);
};

/**
 * @api {patch} /contracts/:id Cancel contract
 * @apiVersion 1.0.0
 * @apiName cancelContract
 * @apiDescription Cancel contract
 * @apiGroup Contract
 *
 * @apiParam (params) {String} id Contract Mongo _id
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 204 OK
  {}
 * @apiUse Forbidden
 */

module.exports.cancelContract = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: createdBy } = req.user;

  const contract = await Contract.findOneAndUpdate({ _id, createdBy }, { $set: { cancelled: true } }, { new: true }).lean();

  if (!contract) {
    throw new Error(error.FORBIDDEN);
  }

  return res.status(204).send();
};
