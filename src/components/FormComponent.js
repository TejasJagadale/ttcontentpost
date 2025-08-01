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
    image: null
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null); // Track which post is being edited
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
    "Education",
    "Stories",
    "Information",
    "Updates"
  ];

  const handleCategorySelect = (category) => {
    setShowCategoryModal(false);
    fetchPosts(category);
  };

  const allTags = [
    // Technology
    "AI",
    "Machine Learning",
    "Gadgets",
    "Software",
    "Hardware",
    "Coding",
    "Cybersecurity",
    "Blockchain",
    "Internet of Things (IoT)",
    "Mobile Tech",
    "Cloud Computing",
    "Robotics",
    "Big Data",
    "Tech Reviews",
    "Innovation",

    // Business
    "Startups",
    "Finance",
    "Stock Market",
    "Investment",
    "Marketing",
    "Entrepreneurship",
    "Leadership",
    "E-commerce",
    "Business Growth",
    "Economy",
    "Corporate News",
    "Mergers & Acquisitions",
    "Business Strategy",
    "Small Business",
    "Business Trends",

    // Science
    "Space",
    "Physics",
    "Chemistry",
    "Biology",
    "Research",
    "Discoveries",
    "Scientific Journals",
    "Astronomy",
    "Genetics",
    "Innovation in Science",
    "Climate Studies",
    "Theoretical Science",
    "Experiments",
    "Scientific Breakthroughs",
    "Evolution",

    // Environment
    "Climate Change",
    "Global Warming",
    "Sustainability",
    "Renewable Energy",
    "Wildlife",
    "Conservation",
    "Pollution",
    "Deforestation",
    "Eco-Friendly Living",
    "Recycling",
    "Natural Disasters",
    "Environmental Policy",
    "Biodiversity",
    "Carbon Emissions",
    "Green Technology",

    // Health
    "Fitness",
    "Nutrition",
    "Mental Health",
    "Medicine",
    "Diseases",
    "Healthcare",
    "Yoga",
    "Medical Research",
    "Wellness",
    "Pandemic",
    "Vaccines",
    "Healthcare Technology",
    "Diet",
    "Mindfulness",
    "Public Health",

    // Entertainment
    "Movies",
    "TV Shows",
    "Celebrities",
    "Music",
    "Web Series",
    "Hollywood",
    "Bollywood",
    "Streaming Platforms",
    "Pop Culture",
    "Film Reviews",
    "Awards",
    "Interviews",
    "Trailers",
    "Theatre",
    "Gossip",

    // Sports
    "Football",
    "Cricket",
    "Olympics",
    "Tennis",
    "Basketball",
    "Fitness",
    "Sports News",
    "Matches",
    "Tournaments",
    "Score Updates",
    "Highlights",
    "Athletes",
    "Coaching",
    "Leagues",
    "Sports Technology",

    // Education
    "Online Learning",
    "Exams",
    "Colleges",
    "Study Tips",
    "Scholarships",
    "Career Guidance",
    "EdTech",
    "Skill Development",
    "Competitive Exams",
    "Student Life",

    // Stories
    "Inspirational",
    "Biographies",
    "Historical",
    "Short Stories",
    "Real-Life Stories",
    "Success Stories",
    "Fiction",
    "Narrative",
    "Culture",
    "Moral Stories",
    "Mythology",
    "Legends",
    "Literature",

    // Information
    "Facts",
    "Data",
    "Tutorials",
    "Guides",
    "Summaries",
    "Knowledge Base",
    "Fun Facts",
    "Tips & Tricks",
    "Research Insights",

    // Updates
    "Breaking News",
    "Announcements",
    "New Releases",
    "Alerts",
    "Current Events",
    "Trending Now",
    "Daily Highlights",
    "Notifications",
    "Latest Happenings",
    "Event Updates",
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

  const fetchPosts = async (category) => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
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
    setEditingId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.category) {
        throw new Error("Category is required");
      }

      let imageUrl = formData.imageUrl || "";

      // Only upload new image if it's a file (not an existing URL)
      if (formData.image && typeof formData.image !== "string") {
        const s3Response = await uploadToS3(formData.image);
        imageUrl = s3Response.key;
      }

      const contentData = {
        ...formData,
        imageUrl,
        tags: Array.isArray(formData.tags) ? formData.tags : [formData.tags]
      };

      let response;
      if (editingId) {
        // For updates, use the category from formData
        response = await axios.put(
          `https://todaytalkserver.onrender.com/api/contents/${formData.category}/${editingId}`,
          contentData
        );
        alert(`Content updated successfully!`);
      } else {
        // For new posts, also use the category from formData
        response = await axios.post(
          `https://todaytalkserver.onrender.com/api/contents/${formData.category}`,
          contentData
        );
        alert(`Content saved successfully!`);
      }

      resetForm();
      if (selectedCategory) {
        fetchPosts(selectedCategory);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
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

  const handleEdit = (post) => {
    setShowModal(false);
    setEditingId(post._id);
    setFormData({
      category: post.category, // Ensure this is set
      title: post.title,
      summary: post.summary,
      description: post.description,
      tags: post.tags,
      status: post.status,
      trending: post.trending,
      image: post.imageUrl,
      imageUrl: post.imageUrl
    });

    if (post.imageUrl) {
      setPreviewImage(post.imageUrl);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        setIsLoading(true);
        await axios.delete(
          `https://todaytalkserver.onrender.com/api/contents/${selectedCategory}/${postId}`
        );
        alert("Post deleted successfully!");
        fetchPosts(selectedCategory); // Refresh the posts list
      } catch (error) {
        console.error("Error deleting post:", error);
        alert(`Error: ${error.response?.data?.message || error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle status toggle for list items
  const handleStatusToggle = async (postId, newStatus) => {
    try {
      setIsLoading(true);
      await axios.patch(
        `https://todaytalkserver.onrender.com/api/contents/toggle-status/${postId}`,
        { status: newStatus }
      );
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, status: newStatus } : post
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle trending toggle for list items
  const handleTrendingToggle = async (postId, newTrending) => {
    try {
      setIsLoading(true);
      await axios.patch(
        `https://todaytalkserver.onrender.com/api/contents/toggle-trending/${postId}`,
        { trending: newTrending }
      );
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, trending: newTrending } : post
        )
      );
    } catch (error) {
      console.error("Error updating trending:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      {isLoading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

      <h2>{editingId ? "Edit Content" : "Create New Content"}</h2>

      <form onSubmit={handleSubmit}>
        {/* Category Select */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            disabled={!!editingId}
          >
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Title Input */}
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

        {/* Summary Textarea */}
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

        {/* Description Textarea */}
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

        {/* Image Upload */}
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
          {editingId && formData.imageUrl && !previewImage && (
            <div className="image-preview">
              <img src={formData.imageUrl} alt="Current" />
              <p className="image-note">
                Current image (upload new to replace)
              </p>
            </div>
          )}
        </div>

        {/* Tags Selection */}
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

        {/* Status and Trending Toggles */}
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

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Processing..." : editingId ? "Update" : "Submit"}
          </button>
          {editingId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={resetForm}
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List Posts Button */}
      <div className="list-posts-container">
        <button
          type="button"
          className="list-posts-btn"
          onClick={() => setShowCategoryModal(true)}
        >
          List Posts
        </button>
      </div>

      {/* Category Selection Modal */}
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

      {/* Posts List Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content posts-modal">
            <button className="close-modal" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h3>Posts in {selectedCategory}</h3>
            <div className="posts-list">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post._id} className="post-item">
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
                    <div className="post-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(post)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(post._id)}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="toggle-actions">
                      <div className="toggle-group">
                        <span>Status:</span>
                        <div
                          className={`toggle-switch ${
                            post.status ? "active" : ""
                          }`}
                          onClick={() =>
                            handleStatusToggle(post._id, !post.status)
                          }
                        >
                          <div className="toggle-knob1"></div>
                        </div>
                        <span>{post.status ? "Active" : "Inactive"}</span>
                      </div>
                      <div className="toggle-group">
                        <span>Trending:</span>
                        <div
                          className={`toggle-switch ${
                            post.trending ? "active" : ""
                          }`}
                          onClick={() =>
                            handleTrendingToggle(post._id, !post.trending)
                          }
                        >
                          <div className="toggle-knob1"></div>
                        </div>
                        <span>{post.trending ? "Yes" : "No"}</span>
                      </div>
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
