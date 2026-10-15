
import { useState } from "react";

export default function NewPost() {
  const [type, setType] = useState("Question");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [abstract, setAbstract] = useState("");
  const [articleText, setArticleText] = useState("");
  const [tags, setTags] = useState("");
  const [message, setMessage] = useState("");

  function changeType(nextType) {
    setType(nextType);
    setTitle("");
    setDescription("");
    setAbstract("");
    setArticleText("");
    setTags("");
    setMessage("");
  }

  function handlePost(event) {
    event.preventDefault();

    const tagList = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (!title.trim() || title.trim().length < 5) {
      setMessage("Error: Title must contain at least 5 characters.");
      return;
    }

    if (title.trim().length > 150) {
      setMessage("Error: Title cannot exceed 150 characters.");
      return;
    }

    if (tagList.length > 3) {
      setMessage("Error: Please enter no more than 3 tags.");
      return;
    }

    if (tagList.some((tag) => tag.length > 30)) {
      setMessage("Error: Each tag must be 30 characters or fewer.");
      return;
    }

    if (
      type === "Question" &&
      !description.trim()
    ) {
      setMessage("Error: Please describe your problem.");
      return;
    }

    if (
      type === "Article" &&
      !abstract.trim()
    ) {
      setMessage("Error: Please enter an abstract.");
      return;
    }

    if (
      type === "Article" &&
      !articleText.trim()
    ) {
      setMessage("Error: Please enter the article text.");
      return;
    }

    // C1 demonstrates submission feedback only.
    // This does not save the post to a server.
    setMessage(`${type} submitted successfully!`);
  }

  return (
    <main className="new-post-page">
      <form className="new-post-form" onSubmit={handlePost}>
        <h1 className="form-heading">New Post</h1>

        <fieldset className="type-selector">
          <legend>Select Post Type:</legend>

          <label>
            <input
              type="radio"
              name="postType"
              checked={type === "Question"}
              onChange={() => changeType("Question")}
            />
            Question
          </label>

          <label>
            <input
              type="radio"
              name="postType"
              checked={type === "Article"}
              onChange={() => changeType("Article")}
            />
            Article
          </label>
        </fieldset>

        <h2 className="section-heading">
          What do you want to ask or share
        </h2>

        <p className="form-description">
          This section is designed based on the type of the post.
          <br />
          {type === "Question"
            ? "For a question, describe the problem you are facing."
            : "For an article, provide an abstract and the article text."}
        </p>

        <div className="form-field">
          <label htmlFor="post-title">Title</label>
          <input
            id="post-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={
              type === "Question"
                ? "Start your question with how, what, why, etc."
                : "Enter a descriptive title"
            }
            maxLength={150}
            required
          />
        </div>

        {type === "Question" ? (
          <div className="form-field">
            <label htmlFor="problem-description">
              Describe your problem
            </label>
            <textarea
              id="problem-description"
              className="question-textarea"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Explain your question or problem..."
              maxLength={5000}
              required
            />
          </div>
        ) : (
          <>
            <div className="form-field">
              <label htmlFor="article-abstract">Abstract</label>
              <textarea
                id="article-abstract"
                className="abstract-textarea"
                value={abstract}
                onChange={(event) => setAbstract(event.target.value)}
                placeholder="Enter a one-paragraph abstract"
                maxLength={1000}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="article-text">Article Text</label>
              <textarea
                id="article-text"
                className="article-textarea"
                value={articleText}
                onChange={(event) => setArticleText(event.target.value)}
                placeholder="Write your article here..."
                maxLength={10000}
                required
              />
            </div>
          </>
        )}

        <div className="form-field">
          <label htmlFor="post-tags">Tags</label>
          <input
            id="post-tags"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="Java, React, Programming"
          />
          <small>Separate tags with commas. Maximum 3 tags.</small>
        </div>

        <div className="post-actions">
          <button type="submit" className="post-button">
            Post
          </button>
        </div>

        {message && (
          <div
            className={
              message.startsWith("Error:")
                ? "form-message error-message"
                : "form-message success-message"
            }
            role="alert"
          >
            <p>{message}</p>
            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Close message"
            >
              Close
            </button>
          </div>
        )}
      </form>
    </main>
  );
}
