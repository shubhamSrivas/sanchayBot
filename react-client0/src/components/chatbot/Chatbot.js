import React, { Component } from "react";
import axios from "axios/index";
import { withRouter } from "react-router-dom";

import Cookie from "universal-cookie";
import { v4 as uuid } from "uuid";

import Message from "./Message";
import Cards from "./Cards";
import QuickReplies from "./QuickReplies";

const cookie = new Cookie();

class Chatbot extends Component {
  messagesEnd; //why the f is this for
  constructor(props) {
    super(props);

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this._handleInputKey = this._handleInputKey.bind(this); // its an really im. step to do
    this._handelQuickReplyPayload = this._handelQuickReplyPayload.bind(this);

    this.state = {
      messages: [],
      showBot: true,
      showWelcomeSent: false,
    };

    if (cookie.get("userID") === undefined) {
      cookie.set("userID", uuid(), { path: "/" });
    }

    console.log(`userID ${cookie.get("userID")}`);
  }

  async df_text_query(text) {
    let says = {
      speaks: "me",
      msg: {
        text: {
          text: text,
        },
      },
    };

    this.setState({ messages: [...this.state.messages, says] });
    const res = await axios.post("/api/df_text_query", {
      text,
      userID: cookie.get("userID"),
    });

    for (let msg of res.data.fulfillmentMessages) {
      says = {
        speaks: "bot",
        msg: msg,
      };
      this.setState({ messages: [...this.state.messages, says] });
    }
  }

  async df_event_query(event) {
    const res = await axios.post("/api/df_event_query", {
      event,
      userID: cookie.get("userID"),
    });

    for (let msg of res.data.fulfillmentMessages) {
      let says = {
        speaks: "bot",
        msg: msg,
      };
      this.setState({ messages: [...this.state.messages, says] });
    }
  }

  hide() {
    this.setState({ showBot: false });
  }

  show() {
    this.setState({ showBot: true });
  }

  resolveAfterXSeconds(x) {
    return new Promise((resolve) => {
      // P must be capital for promise
      setTimeout(() => {
        resolve(x);
      }, x * 1000);
    });
  }

  async componentDidMount() {
    this.df_event_query("welcome");

    if (!this.state.showWelcomeSent && window.location.pathname === "/shop") {
      await this.resolveAfterXSeconds(2);
      this.df_event_query("WELCOME_SHOP");
      this.setState({ showWelcomeSent: true, showBot: true });
    }

    this.props.history.listen(() => {
      console.table([
        "history.location.pathname",
        `${this.props.history.location.pathname}`,
      ]);

      if (
        !this.state.showWelcomeSent &&
        this.props.history.location.pathname === "/shop"
      ) {
        this.df_event_query("WELCOME_SHOP");
        this.setState({ showWelcomeSent: true, showBot: true });
      }
    });
  }

  componentDidUpdate() {
    this.messagesEnd.scrollIntoView({ behaviour: "smooth" });
    if (this.talkInput) {
      this.talkInput.focus();
    }
  }

  renderCards(cards) {
    return cards.map((card, i) => <Cards key={i} payload={card.structValue} />);
  }

  renderOneMessage(message, i) {
    if (message.msg && message.msg.text && message.msg.text.text) {
      return (
        <Message key={i} speaks={message.speaks} text={message.msg.text.text} />
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.cards
    ) {
      return (
        <div key={i}>
          <div className="card-panel grey lighten-5 z-depth-1">
            <div style={{ overflow: "hidden" }}>
              <div className="col s2">
                <a className="btn-floating btn-large waves-effect waves-light red ">
                  {message.speaks}
                </a>
              </div>
              <div style={{ overflow: "auto", overflowY: "scroll" }}>
                <div
                  style={{
                    height: 300,
                    width:
                      message.msg.payload.fields.cards.listValue.values.length * //length or ()
                      270,
                  }}
                >
                  {this.renderCards(
                    message.msg.payload.fields.cards.listValue.values
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.quick_replies
    ) {
      return (
        <QuickReplies
          text={
            message.msg.payload.fields.text
              ? message.msg.payload.fields.text
              : null
          }
          key={i}
          replyClick={this._handelQuickReplyPayload}
          speaks={message.speaks}
          payload={message.msg.payload.fields.quick_replies.listValue.values}
        />
      );
    } else {
      return <h2>non defined</h2>;
    }
  }

  renderMessages(stateMessages) {
    if (stateMessages) {
      return stateMessages.map((message, i) => {
        return this.renderOneMessage(message, i);
      });
    } else {
      return null;
    }
  }

  _handleInputKey(e) {
    // console.log("--------------------------");
    // console.log(e.key);
    // console.log(e.keyCode);
    // console.log(e.target.value);

    if (e.key === "Enter") {
      this.df_text_query(e.target.value);
      e.target.value = "";
    }
  }

  _handelQuickReplyPayload(payload, text) {
    switch (payload) {
      case "recommend_yes":
        this.df_event_query("SHOW_RECOMMENDATIONS");
        break;
      case "case_masterclass":
        this.df_event_query("MASTERCLASS");
        break;
      default:
        this.df_text_query(text);
    }
  }

  render() {
    if (this.state.showBot) {
      return (
        <div
          style={{
            height: 500,
            width: 400,
            position: "absolute",
            bottom: 0,
            right: 0,
            border: "1px solid lightgrey",
          }}
        >
          <nav>
            <div className="nav-wrapper">
              <a className="brand-logo">ChatBot</a>
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li>
                  <a onClick={this.hide}>Close</a>
                </li>
              </ul>
            </div>
          </nav>
          <div
            id="chatbot"
            style={{ height: 388, width: "100%", overflow: "auto" }}
          >
            {this.renderMessages(this.state.messages)}
            <div
              ref={(el) => {
                this.messagesEnd = el;
              }}
              style={{ float: "left", clear: "both" }}
            ></div>
          </div>
          <div className="col s12">
            <input
              style={{
                margin: 0,
                paddingLeft: "1%",
                paddingRight: "1%",
                width: "98%",
              }}
              placeholder="type a text"
              type="text"
              ref={(input) => {
                this.talkInput = input;
              }}
              onKeyPress={this._handleInputKey}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div
          style={{
            height: 40,
            width: 400,
            position: "absolute",
            bottom: 0,
            right: 0,
            border: "1px solid lightgrey",
          }}
        >
          <nav>
            <div className="nav-wrapper">
              <a className="brand-logo">ChatBot</a>
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li>
                  <a onClick={this.show}>Show</a>
                </li>
              </ul>
            </div>
          </nav>
          <div
            ref={(el) => {
              this.messagesEnd = el;
            }}
            style={{ float: "left", clear: "both" }}
          ></div>
        </div>
      );
    }
  }
}

export default withRouter(Chatbot);
