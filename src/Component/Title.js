import React, { useState } from "react";

const Title = () => {
  return (
    <div id="title">
      <form
        onSubmit={(event) => {
          const title = event.target.value;
          window.todoAPI.setTitle(title);
        }}
      >
        Title of List: <input id="title" type="text" />
        <button id="btn" className="submitBtn">
          set
        </button>
      </form>
    </div>
  );
};

export default Title;
