import React from "react";

const QuickReply = (props) => {
  if (props.reply.structValue.fields.payload) {
    return (
      <a
        style={{ margin: 3 }}
        className="btn-floating waves-effect waves-light"
        onClick={() =>
          props.click(
            props.reply.structValue.fields.payload.stringValue,
            props.reply.structValue.fields.text.stringValue
          )
        }
      >
        {props.reply.structValue.fields.text.stringValue}
        <i className="material-icons right">send</i>
      </a>
    );
  } else {
    return (
      <a
        target="_blank"
        style={{ margin: 3 }}
        className="btn-floating waves-effect waves-light"
        href={props.reply.structValue.fields.link.stringValue}
      >
        {props.reply.structValue.fields.text.stringValue}
        <i className="material-icons right">send</i>
      </a>
    );
  }
};

export default QuickReply;
