import { useEffect, useState } from "react";
import { Comments } from "../db/models/comments";
import EachComments from "./each-comments";

const Comment = () => {
  const [comments, setComments] = useState<Comments[]>([]);
  const [isError, setIsError] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // fetch list of comments from `/api/comments` endpoint which in turn
  // reads from the comments collection
  const fetchComments = () => {
    fetch("/api/comments")
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setComments(data.result);
        } else {
          setIsError(true);
        }
      })
      .catch(() => {
        setIsError(true);
      });
  };

  // create a new comment by sending a POST request to `/api/comments` endpoint
  const addComment = () => {
    fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({
        name: nameInput,
        content: commentInput,
        date: new Date().toJSON(),
      }),
    }).then(() => {
      setCommentInput("");
      setNameInput("");
      fetchComments();
    });
  };

  // query the collection for a comments by sending a GET request to
  // the `/api/comments/search` endpoint
  const searchQuery = () => {
    fetch(`/api/comments/search?q=${encodeURI(searchInput)}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setComments(data.result);
        }
      });
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // render the comments and add the functions defined above to their
  // respective event handlers
  return (
    <div className="max-w-2xl mx-auto">
      <input
        className="border border-gray-300 text-gray-900 dark:text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-2 mb-6"
        placeholder="Search..."
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyUp={searchQuery}
      />

      {comments.length ? (
        comments.map((comment) => (
          <EachComments comment={comment} key={comment.id} />
        ))
      ) : (
        <p className="relative grid grid-cols-1 gap-4 p-4 mb-8 border rounded-lg bg-white shadow-lg">
          No comments...
        </p>
      )}
      <h3>Leave a comment</h3>
      <div className="mb-6 mt-6">
        <input
          className="border border-gray-300 text-gray-900 dark:text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Name:"
          onChange={(e) => setNameInput(e.target.value)}
          value={nameInput}
        />
      </div>
      <div className="mb-6 mt-6">
        <textarea
          className="border border-gray-300 text-gray-900 dark:text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Say something..."
          onChange={(e) => setCommentInput(e.target.value)}
          value={commentInput}
        />
      </div>
      <button
        type="submit"
        className="bg-gray-600 hover:bg-gray-800 focus:ring-4 focus:ring-blue-300 font-medium text-white rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mb-3"
        onClick={addComment}
      >
        Post comment
      </button>
      {isError && (
        <p className="text-red-600">Something went wrong: {isError}</p>
      )}
    </div>
  );
};

export default Comment;