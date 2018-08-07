import React from "react";
import { render } from "react-dom";
import { observable, action, set, toJS } from "mobx";
import { observer } from "mobx-react";
import DevTools from "mobx-react-devtools";

window.toJS = toJS
window.setMobx = set

class AppState {

  @observable
  title= "Foo"

  @observable
  author= {
    name: "Michel",
    extra: {
      abc: "def",
      g: {
        e: {
          f: "h"
        }
      }
    }
  }

  @observable
  likes= [
    "John", "Sara"
  ]

  @observable
  emptyState= new Map()

}


function getReviewerById(message, id) {
  if (message.emptyState.has(id)) return message.emptyState.get(id);
  else 
    message.emptyState.set(id, {})

  return message.emptyState.get(id);
}

//
// So performance wise it is best to dereference as late as possible.
//

const Message = observer(({ message }) =>
  <div>
    <h3>Title: {message.title}</h3>
    <Author author={message.author} />
    <AuthorExtra author={message.author} />
    <Likes likes={message.likes} />
    {
      ["1", "2", "3"].map(id => <Reviewer key={id} message={message} id={id}/>)
    }
  </div>
)

const Reviewer = observer(({ message, id}) => 
  <pre>
    {JSON.stringify(getReviewerById(message, id), null, 2)}
  </pre>  
)

const Author = observer(({ author }) =>
  <h4>Author: {author.name}</h4>
)

const AuthorExtra = observer(({ author }) =>
  <h4>Author: {author.extra.g.e.f}</h4>
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
