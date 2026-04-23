import dotenv from 'dotenv';
dotenv.config();

/**
 * Sends a new order notification email using Brevo (formerly Sendinblue) API.
 * Using standard fetch (available in Node 18+) for a lightweight and robust implementation.
 */
export async function sendNewOrderEmail(order, userEmails) {
  if (!userEmails || userEmails.length === 0) return;

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('BREVO_API_KEY is missing in environment variables');
    return;
  }

  const orderId = order.id;
  const projectName = order.projectName;
  const customerName = order.customerDetails?.name || 'N/A';
  const totalValue = order.summary?.grandTotal || order.totalValue || 0;

  const htmlContent = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2563eb;">New Order Created: ${orderId}</h2>
      <p>A new order has been generated in the system. Here are the details:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr style="background-color: #f3f4f6;">
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Field</th>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Value</th>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Project Name</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${projectName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Customer Name</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${customerName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Order Number</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${order.orderDetails?.orderNumber || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Grand Total</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">₹${totalValue.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Created By</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${order.createdBy || 'System'}</td>
        </tr>
      </table>

      <div style="margin-top: 30px;">
        <p>Please log in to the system to view more details.</p>
        <a href="${process.env.APP_URL || 'http://localhost:5173'}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Order</a>
      </div>

      <footer style="margin-top: 40px; font-size: 0.8em; color: #777; border-top: 1px solid #eee; padding-top: 20px;">
        This is an automated notification from Technoventor OMS.
      </footer>
    </div>
  `;

  const emailData = {
    sender: { name: "Technoventor OMS", email: "asim@technoventor.com" },
    to: userEmails.map(email => ({ email: email })),
    subject: `New Order Created: ${projectName} (${orderId})`,
    htmlContent: htmlContent
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(emailData)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Brevo API Error: ${JSON.stringify(result)}`);
    }

    console.log('Brevo Email Sent Successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email via Brevo:', error.message);
    throw error;
  }
}
