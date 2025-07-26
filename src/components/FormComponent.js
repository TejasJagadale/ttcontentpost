import React, { useState, useRef } from "react";
import "./FormComponent.css";
import axios from "axios";

const FormComponent = () => {
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    summary: "",
    description: "",
    tags: [],
    status: false,
    trending: false,
    image: null // Added for image upload
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loader
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null
    }));
    setPreviewImage(null);
    fileInputRef.current.value = "";
  };

  const categories = [
    "Technology",
    "Business",
    "Science",
    "Environment",
    "Health",
    "Entertainment",
    "Sports",
    "Education"
  ];

  const handleCategorySelect = (category) => {
    setShowCategoryModal(false);
    fetchPosts(category);
  };

  // Ensure your tags array is defined
  const allTags = [
    "Innovation",
    "Startup",
    "Research",
    "Climate",
    "Fitness",
    "Movies",
    "Football",
    "Learning",
    "AI",
    "Finance"
  ];

  const [wordCount, setWordCount] = useState({
    summary: 0,
    description: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === "summary" || name === "description") {
      const words = value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
      setWordCount((prev) => ({
        ...prev,
        [name]: words
      }));
    }
  };

  // Function to fetch posts
  const fetchPosts = async (category) => {
    try {
      setIsLoading(true); // Start loader
      const response = await axios.get(
        `https://todaytalkserver.onrender.com/api/contents/${category}`
      );
      setPosts(response.data);
      setSelectedCategory(category);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching posts:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  const handleTagChange = (tag) => {
    setFormData((prev) => {
      if (prev.tags.includes(tag)) {
        return {
          ...prev,
          tags: prev.tags.filter((t) => t !== tag)
        };
      } else {
        return {
          ...prev,
          tags: [...prev.tags, tag]
        };
      }
    });
  };

  const toggleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      status: !prev.status
    }));
  };

  const toggleTrending = () => {
    setFormData((prev) => ({
      ...prev,
      trending: !prev.trending
    }));
  };

  const resetForm = () => {
    setFormData({
      category: "",
      title: "",
      summary: "",
      description: "",
      tags: [],
      status: false,
      trending: false,
      image: null
    });
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loader when form is submitted

    try {
      let imageUrl = "";

      if (formData.image) {
        const s3Response = await uploadToS3(formData.image);
        imageUrl = s3Response.key;
        console.log("Image uploaded to:", imageUrl);
      }

      const contentData = {
        ...formData,
        imageUrl,
        tags: Array.isArray(formData.tags) ? formData.tags : [formData.tags]
      };

      const response = await axios.post(
        `https://todaytalkserver.onrender.com/api/contents/${formData.category}`,
        contentData
      );

      if (!response.data.imageUrl) {
        console.warn("Backend didn't return imageUrl, checking saved data...");
      }

      alert(`Content saved successfully!`);
      resetForm();
    } catch (error) {
      console.error("Submission failed:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false); // Stop loader when done
    }
  };

  const uploadToS3 = async (file) => {
    try {
      const { data } = await axios.get(
        "https://todaytalkserver.onrender.com/api/s3/upload-url",
        {
          params: { fileType: file.type }
        }
      );

      await axios.put(data.uploadUrl, file, {
        headers: { "Content-Type": file.type }
      });

      return {
        location: data.publicUrl,
        key: `https://videosbucketlookit.s3.ap-south-1.amazonaws.com/${data.key}`
      };
    } catch (error) {
      console.error("S3 Upload Failed:", error);
      throw new Error("Image upload failed: " + error.message);
    }
  };

  return (
    <div className="form-container">
      {isLoading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <h2>Create New Content</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="summary">Summary (max 150 words)</label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            required
            maxLength={1000}
            placeholder="Brief summary (150 words max)"
          />
          <div className="word-count">{wordCount.summary}/150 words</div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (max 1000 words)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            maxLength={7000}
            placeholder="Detailed description (1000 words max)"
          />
          <div className="word-count">{wordCount.description}/1000 words</div>
        </div>

        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
          />
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Preview" />
              <button
                type="button"
                onClick={removeImage}
                className="remove-image-btn"
              >
                Remove Image
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Tags</label>
          <div className="tags-container">
            {allTags.map((tag, index) => (
              <div key={index} className="tag-item">
                <input
                  type="checkbox"
                  id={`tag-${index}`}
                  checked={formData.tags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                />
                <label htmlFor={`tag-${index}`}>{tag}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="toggle-group">
          <div className="toggle-item">
            <label>Status</label>
            <div
              className={`toggle-switch ${formData.status ? "active" : ""}`}
              onClick={toggleStatus}
            >
              <div className="toggle-knob"></div>
            </div>
            <span>{formData.status ? "Active" : "Inactive"}</span>
          </div>

          <div className="toggle-item">
            <label>Trending</label>
            <div
              className={`toggle-switch ${formData.trending ? "active" : ""}`}
              onClick={toggleTrending}
            >
              <div className="toggle-knob"></div>
            </div>
            <span>{formData.trending ? "Yes" : "No"}</span>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {/* Add the List Posts button */}
      <div className="list-posts-container">
        <button
          type="button"
          className="list-posts-btn"
          onClick={() => setShowCategoryModal(true)}
        >
          List Posts
        </button>
      </div>

      {showCategoryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setShowCategoryModal(false)}
            >
              ×
            </button>
            <h3>Select a Category</h3>
            <div className="categories-list">
              {categories.map((category) => (
                <div
                  key={category}
                  className="category-item"
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal for displaying posts */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h3>Posts in {selectedCategory}</h3>
            <div className="posts-list">
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <div key={index} className="post-item">
                    <h4>{post.title}</h4>
                    <p className="post-summary">{post.summary}</p>
                    {post.imageUrl && (
                      <div className="post-image-container">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="post-image"
                        />
                      </div>
                    )}
                    <div className="post-tags">
                      {post.tags.map((tag, i) => (
                        <span key={i} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="post-status">
                      Status: {post.status ? "Active" : "Inactive"} | Trending:{" "}
                      {post.trending ? "Yes" : "No"}
                    </div>
                  </div>
                ))
              ) : (
                <p>No posts found in this category.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormComponent;
