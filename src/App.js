import { useState, useEffect } from "react";
import "./App.css";
import { createMessageObject, steps } from "./BotReplies";

const userErrorReply = createMessageObject(
  "That's not quite right, please try again.",
  "bot"
);

const goodbyeMessage = createMessageObject(
  "Thanks for filling out the form",
  "bot"
);

const LAST_STEP = Math.max(...steps.map((s) => s.step));

const App = () => {
  const [chats, setChats] = useState([steps[0].botSays]);
  const [step, setStep] = useState(1);
  const [chatActive, setChatActive] = useState(true);

  const sendEmail = () => {
    const user = chats.find((chat) => chat.responseName === "user").message;
    const customerEmail = chats.find(
      (chat) => chat.responseName === "customerEmail"
    ).message;
    const customerQuery = chats.find(
      (chat) => chat.responseName === "customerQuery"
    ).message;

    const body = { user, customerEmail, customerQuery };

    fetch("https://chattulika.herokuapp.com/", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setChatActive(false);
          setChats([...chats, goodbyeMessage]);
        } else {
          throw new Error("something went wrong");
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    const isLastStep = step === LAST_STEP + 1;

    if (isLastStep) {
      setChatActive(false);
      sendEmail();
    }

    const currentStepDetails = isLastStep
      ? { botSays: goodbyeMessage }
      : steps.find((s) => s.step === step);

    setChats([...chats, currentStepDetails.botSays]);
  }, [step]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const input = e.target.elements["query"];
    const query = input.value;
    if (!query) {
      return;
    }
    const nextStep = step + 1;
    const currentStepDetails = steps.find((s) => s.step === step);

    const userMessage = createMessageObject(
      query,
      "user",
      currentStepDetails.name
    );
    const newChats = [...chats, userMessage];

    if (currentStepDetails.validation) {
      if (currentStepDetails.validation(query)) {
        setStep(nextStep);
      } else {
        newChats.push(userErrorReply);
      }
    } else {
      setStep(nextStep);
    }

    setChats(newChats);
    input.value = "";
  };

  return (
    <div className="chat-widget">
      <header>
        <h3>Chat Support</h3>
      </header>
      <div className="content">
        <div className="chats">
          {chats.map((msg, index) => {
            return (
              <div
                key={index}
                className={"chat-bubble " + msg.userType + "-bg"}
              >
                <p>{msg.message}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="message-box">
        {chatActive ? (
          <form onSubmit={handleSubmit} disabled>
            <input type="text" name="query" placeholder="Type your query" />
            <button type="submit">Send</button>
          </form>
        ) : (
          <div className="chat-disabled">
            <span>Chat has ended. Please check your inbox - spam and promotions.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
