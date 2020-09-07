import React, { Component } from "react";
import QuickReply from "./QuickReply";

class QuickReplies extends Component {
  constructor(props) {
    super(props);
    this._handleClick = this._handleClick.bind(this);
  }

  _handleClick(payload, text) {
    this.props.replyClick(payload, text); // is this accessing a function via props?
  }

  renderQuickReply(reply, i) {
    // console.table(["Reply", `${reply}`]);
    // console.log(reply);
    // return <QuickReplies key={i} click={this._handleClick} reply={reply} />;

    return <QuickReply key={i} click={this._handleClick} reply={reply} />;
  }

  renderQuickReplies(Replies) {
    // console.table(["Replies", `${Replies}`]);
    // console.log(Replies);
    // console.log(this.props);
    if (Replies) {
      return Replies.map((reply, i) => {
        return this.renderQuickReply(reply, i);
      });
    } else return null;
  }

  render() {
    return (
      <div className="col s12 m8 offset-m2 l6 offset-l3">
        <div className="card-panel grey lighten-5 z-depth-1">
          <div className="row valign-wrapper">
            <div className="col s2">
              <a className="btn-floating btn-large waves-effect waves-light red ">
                {this.props.speaks}
              </a>
            </div>
            <div className="col s10" id="quick-replies">
              {this.props.text && <p>{this.props.text.stringValue}</p>}
              {this.renderQuickReplies(this.props.payload)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default QuickReplies;
