export const createMessageObject = (message, userType, responseName = "") => {
  return {
    message,
    userType,
    responseName,
  };
};

export const steps = [
  {
    step: 0,
    name: "",
    botSays: createMessageObject("Hi, I am here to help you.", "bot"),
    validation: null,
  },
  {
    step: 1,
    name: "user",
    botSays: createMessageObject("May I know your name?", "bot"),
    validation: (name) => !!name,
  },
  {
    step: 2,
    name: "customerEmail",
    botSays: createMessageObject(
      "Where can you reach you, enter the email address?",
      "bot"
    ),
    validation: (email) => {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      return re.test(String(email).toLowerCase());
    },
  },
  {
    step: 3,
    name: "customerQuery",
    botSays: createMessageObject(
      "Thanks for the info, type in the query you want me to forward to my team.",
      "bot"
    ),
    validation: (query) => !!query,
  },
];
