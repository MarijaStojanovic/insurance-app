const { Contract } = require('../../models');
const error = require('../../middlewares/errorHandling/errorConstants');

/**
 * @api {post} /contracts Add new contract
 * @apiVersion 1.0.0
 * @apiName addContract
 * @apiDescription Add new contract
 * @apiGroup Contract
 *
 * @apiParam {String} title Contract title
 * @apiParam {String} companyName Contract company name
 * @apiParam {Number} yearlyPrice Contract yearly price
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
{
  "message": "Successfully saved new contract",
  "results": {
    "canceled": false,
    "_id": "5bccbc60ae14fc1f4178d8ba",
    "title": "This is a contract title",
    "companyName": "HolyCode",
    "yearlyPrice": 2000,
    "createdBy": "5bcc565c915d5d15e6378db3",
    "createdAt": "2018-10-21T17:50:24.489Z",
    "updatedAt": "2018-10-21T17:50:24.489Z",
    "__v": 0
  }
}
 * @apiUse MissingParamsError
 */
module.exports.addContract = async (req, res) => {
  const { title, companyName, yearlyPrice } = req.body;

  if (!title || !companyName || !yearlyPrice) {
    throw new Error(error.MISSING_PARAMETERS);
  }
  const contract = await new Contract({ title, companyName, yearlyPrice, createdBy: req.user._id }).save();

  return res.status(201).send({
    message: 'Successfully saved new contract',
    results: contract,
  });
};

/**
 * @api {put} /contracts Edit contract
 * @apiVersion 1.0.0
 * @apiName editContract
 * @apiDescription Update contract
 * @apiGroup Contract
 *
 * @apiParam {String} [title] Contract title
 * @apiParam {String} [companyName] Contract company name
 * @apiParam {Number} [yearlyPrice] Contract yearly price
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
{
  "message": "Contract successfully updated",
  "results": {
    "canceled": false,
    "_id": "5bccbc60ae14fc1f4178d8ba",
    "title": "This is a new title",
    "companyName": "HolyCode",
    "yearlyPrice": 2000,
    "createdBy": "5bcc565c915d5d15e6378db3",
    "createdAt": "2018-10-21T17:50:24.489Z",
    "updatedAt": "2018-10-21T17:51:02.445Z",
    "__v": 0
  }
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
    { new: true });

  if (!results) {
    throw new Error(error.FORBIDDEN);
  }

  return res.status(200).send({
    message: 'Contract successfully updated',
    results,
  });
};
