// User Schema
// id
// firstname
// lastname
// password
// email
// transction_id
// amount
// token

// Endpoint to handle payment and assign tokens
app.post("/add-payment", async (req, res) => {
  try {
    const { userId, amount } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // User makes a payment from a payment gateway
    const payment = new Payment({
      userId,
      amount,
    });

    // Create a transaction entry for transaction history to keep record
    const transaction = new Transaction({
      userId,
      amount,
      status: "completed",
      timestamp: new Date(),
    });

    // Assuming 1 token = 2 rupees
    user.tokens += amount;

    user.transactions.push(transaction._id);

    // Save user, and transaction details
    await user.save();
    await transaction.save();

    return res.status(200).json({ message: "Payment successful", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Endpoint to initiate a transaction
app.post("/transactions", async (req, res) => {
  try {
    const { senderId, recipientId, amount } = req.body;

    // Check if sender and recipient exist
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      return res.status(404).json({ message: "Sender or recipient not found" });
    }

    // Deduct tokens from sender and add to recipient within a transaction
    const transaction = new Transaction({
      sender: senderId,
      recipient: recipientId,
      amount,
      status: "pending",
    });

    // start the transaction process
    const session = await Transaction.startSession();
    session.startTransaction();
    try {
      await transaction.save();
      sender.tokens -= amount;
      recipient.tokens += amount;
      await sender.save();
      await recipient.save();
      await session.commitTransaction();
      session.endSession();
      transaction.status = "completed";
      await transaction.save();
      return res
        .status(200)
        .json({ message: "Transaction successful", transaction });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      transaction.status = "failed";
      await transaction.save();
      return res
        .status(500)
        .json({ message: "Transaction failed", error: error.message });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

