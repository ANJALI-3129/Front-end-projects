// import { useReducer } from "react";
import { useState, useRef, useEffect } from "react";
import { db } from "./firebaseinit";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";

// function blogsReducer(state, action) {
//   switch (action.type) {
//     case "Add":
//       return [action.blog, ...state];
//     case "Remove":
//       return state.filter((blog, index) => index !== action.index);
//     default:
//       return [];
//   }
// }
export default function Blog() {
  // const [title, setTitle] = useState("");
  // const [content, setContent] = useState("");
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [blogs, setBlogs] = useState([]);
  // const [blogs, dispatch] = useReducer(blogsReducer, []);
  const titleRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setBlogs([{ title: formData.title, content: formData.content }, ...blogs]);
    // dispatch({
    //   type: "Add",
    //   blog: { title: formData.title, content: formData.content },
    // });
    setFormData({ title: "", content: "" });
    console.log(blogs);
    titleRef.current.focus();
    const docRef = doc(collection(db, "blogs"));
    await setDoc(docRef, {
      title: formData.title,
      content: formData.content,
      createOn: new Date(),
    });
  }
  async function removeBlog(id) {
    // setBlogs(blogs.filter((blog, index) => i !== index));
    // dispatch({ type: "Remove", index: i });

    const docRef = doc(db, "blogs", id);
    await deleteDoc(docRef);
  }
  useEffect(() => {
    titleRef.current.focus();
  }, []);
  useEffect(() => {
    // async function fetchData() {
    //   const snapShot = await getDocs(collection(db, "blogs"));
    //   console.log(snapShot);
    //   const blogs = snapShot.docs.map((doc) => {
    //     return {
    //       id: doc.id,
    //       ...doc.data(),
    //     };
    //   });
    //   console.log(blogs);
    //   setBlogs(blogs);
    // }

    // fetchData();
    const unsub = onSnapshot(collection(db, "blogs"), (snapShot) => {
      const blogs = snapShot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setBlogs(blogs);
    });
  }, []);
  useEffect(() => {
    if (blogs.length && blogs[0].title) {
      document.title = blogs[0].title;
    } else {
      document.title = "No Blogs";
    }
  }, [blogs]);
  return (
    <>
      <h1> Write a Blog </h1>
      <div className="section">
        <form onSubmit={handleSubmit}>
          {" "}
          <Row label="Title">
            <input
              className="input"
              placeholder="Enter the Title here..."
              value={formData.title}
              ref={titleRef}
              onChange={(e) => {
                setFormData({
                  title: e.target.value,
                  content: formData.content,
                });
              }}
            />
          </Row>
          <Row label="content">
            <textarea
              className="input content"
              placeholder="content"
              required
              value={formData.content}
              onChange={(e) => {
                setFormData({ title: formData.title, content: e.target.value });
              }}
            />
          </Row>
          <button className="btn">ADD</button>
        </form>
      </div>
      <hr></hr>

      <h2> Blogs </h2>
      {blogs.map((blog, i) => (
        <div className="blog" key={i}>
          <h3>{blog.title}</h3>
          <p>{blog.content}</p>
          <div className="blog-btn">
            <button onClick={() => removeBlog(blog.id)} className="btn remove">
              Delete
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

function Row(props) {
  const { label, children } = props;
  return (
    <div className="row">
      <label>
        {label}
        <br />
        {children}
      </label>
    </div>
  );
}
