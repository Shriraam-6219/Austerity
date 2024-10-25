import Transaction from '../models/TransactionModel.js'; // Import Transaction model
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

async function getTransactionSummary(userId) {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()); // 1 month ago
    const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()); // 1 year ago
    
    // Aggregate transactions by date range and type
    const summary = await Transaction.aggregate([
        { $match: { user:new mongoose.Types.ObjectId(userId) } },
        {
            $facet: {
                weekly: [
                    { $match: { date: { $gte: lastWeek } } },
                    { $group: { _id: "$transactionType", total: { $sum: "$amount" } } }
                ],
                monthly: [
                    { $match: { date: { $gte: lastMonth } } },
                    { $group: { _id: "$transactionType", total: { $sum: "$amount" } } }
                ],
                yearly: [
                    { $match: { date: { $gte: lastYear } } },
                    { $group: { _id: "$transactionType", total: { $sum: "$amount" } } }
                ],
                byType: [
                    { $group: { _id: "$category", total: { $sum: "$amount" } } }
                ]
            }
        }
    ]);
    
    return summary[0];
}
function analyzeExpenses(summary) {
    const byType = summary.byType || [];
    const mostExpenseType = byType.reduce((max, type) => type.total > max.total ? type : max, { total: 0 });
    const leastExpenseType = byType.reduce((min, type) => type.total < min.total ? type : min, { total: Infinity });

    return {
        mostExpenseType: mostExpenseType._id || 'None',
        leastExpenseType: leastExpenseType.total === Infinity ? 'None' : leastExpenseType._id || 'None'
    };
}


async function sendReportByEmail(email, summary, expenseAnalysis) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'vigneshsobalamurugan2005@gmail.com',
            pass:'fsum hfnq rlns oyms'
        }
    });

    const mailOptions = {
        from: 'vigneshsobalamurugan2005@gmail.com',
        to: email,
        subject: 'Transaction Summary Report',
        html: `
            <h1>Transaction Report</h1>
            <h2>Weekly Summary</h2>
            <p>Total Income: ${summary.weekly.find(t => t._id === 'income')?.total || 0}</p>
            <p>Total Expense: ${summary.weekly.find(t => t._id === 'expense')?.total || 0}</p>

            <h2>Monthly Summary</h2>
            <p>Total Income: ${summary.monthly.find(t => t._id === 'income')?.total || 0}</p>
            <p>Total Expense: ${summary.monthly.find(t => t._id === 'expense')?.total || 0}</p>

            <h2>Yearly Summary</h2>
            <p>Total Income: ${summary.yearly.find(t => t._id === 'income')?.total || 0}</p>
            <p>Total Expense: ${summary.yearly.find(t => t._id === 'expense')?.total || 0}</p>

            <h2>Expense Analysis</h2>
            <p>Most Spent on: ${expenseAnalysis.mostExpenseType}</p>
            <p>Least Spent on: ${expenseAnalysis.leastExpenseType}</p>
        `
    };

    await transporter.sendMail(mailOptions);
}

export const generateAndSendReport = async (req, res) => {
    try {
        console.log('hi');
        const { userId ,email} = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID and email are required.' });
        }

        const summary = await getTransactionSummary(userId);
        const expenseAnalysis = analyzeExpenses(summary);

        await sendReportByEmail(email, summary, expenseAnalysis);
        console.log('Report sent successfully');

        res.status(200).json({ message: 'Report sent successfully.' });
    } catch (error) {
        console.error('Error generating or sending report:', error);
        res.status(500).json({ error: 'Failed to generate or send report. Please try again later.' });
    }
};
