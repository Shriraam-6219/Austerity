import express from 'express';
import { addTransactionController, deleteTransactionController, getAllTransactionController, updateTransactionController,AddRequiringPayment } from '../controllers/transactionController.js';
import {generateAndSendReport } from '../DB/sendMail.js';

const router = express.Router();

router.route("/addTransaction").post(addTransactionController);

router.route("/getTransaction").post(getAllTransactionController);

router.route("/deleteTransaction/:id").post(deleteTransactionController);

router.route('/updateTransaction/:id').put(updateTransactionController);

router.route('/addreqpayment').post(AddRequiringPayment);
router.route('/sendEmail').post(generateAndSendReport);

export default router;