import Message from "../models/message.js";

const msgController = {
  // Save message
  saveMessages: (req, res) => {
    const params = req.body;
    const message = new Message();
    message.message = params.message;
    message.from = params.from;

    message.save().then((messageStore) => {
      if (!messageStore) {
        return res.send({
          status: 400,
          message: "Error in save message",
        });
      }
      return res.send({
        status: 200,
        messageStore,
      });
    })
      .catch((error) => {
      return res.send({
        status: 500,
        message: "Error in server",
      });
    });
  },

  // Get all messages
  getMessages: (req, res) => {
    Message.find({})
      .sort("-_id")
      .exec()
      .then((messages) => {
        if (!messages) {
          return res.send({
            status: 204,
            message: "No exists messahges",
          });
        }
        return res.send({
          status: 200,
          messages,
        });
      })
      .catch((error) => {
        return res.send({
          status: 500,
          message: "Error getting messages",
        });
      });
  },
};

export default msgController;
