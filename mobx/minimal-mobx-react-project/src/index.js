import React from "react";
import { render } from "react-dom";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import DevTools from "mobx-react-devtools";

class AppState {

  @observable
  title= "Foo"

  @observable
  author= {
    name: "Michel"
  }

  @observable
  likes= [
    "John", "Sara"
  ]

}

//
// So performance wise it is best to dereference as late as possible.
//

const Message = observer(({ message }) =>
  <div>
    <h3>Title: {message.title}</h3>
    <Author author={message.author} />
    <Likes likes={message.likes} />
  </div>
)

const Author = observer(({ author }) =>
  <h4>Author: {author.name}</h4>
)

const Likes = observer(({ likes }) =>
  <ul>
    {likes.map(like =>
      <li key={like} >{like}</li>
    )}
  </ul>
)

window.message = new AppState()

render(
  <div>
    <Message message={window.message} />
    <DevTools />
  </div>,
  document.getElementById("root")
);
