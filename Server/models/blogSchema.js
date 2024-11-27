import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: [10, "Blog Title Must Contains at Least 10 Characters"],
    maxLength: [40, "Blog Title cannot exceed 10 Characters"],
  },
  mainImage: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  intro: {
    type: String,
    required: true,
    minLength: [250, "Blog Intro Must Contains at Least 250 Characters"],
  },
  paragraphOneIamge: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  paragraphOnedesc: {
    type: String,

    minLength: [
      50,
      "Paragraph Description Must Contains at Least 50 Characters",
    ],
  },
  paragraphOneTitle: {
    type: String,
    minLength: [
      50,
      "Paragraph Description Must Contains at Least 50 Characters",
    ],
  },
  paragraphTwoIamge: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  paragraphTwodesc: {
    type: String,

    minLength: [
      50,
      "Paragraph Description Must Contains at Least 50 Characters",
    ],
  },
  paragraphTwoTitle: {
    type: String,
    minLength: [
      50,
      "Paragraph Description Must Contains at Least 50 Characters",
    ],
  },
  paragraphThreeIamge: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  paragraphThreedesc: {
    type: String,

    minLength: [
      50,
      "Paragraph Description Must Contains at Least 50 Characters",
    ],
  },
  paragraphThreeTitle: {
    type: String,
    minLength: [
      50,
      "Paragraph Description Must Contains at Least 50 Characters",
    ],
  },
  category:{
    type:String,
    required:true
  },
  createdBy:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required:true
  },
  authorName:{
   type:String,
   required:true,
  },
  
  authorAvatar:{
   type:String,
   required:true,
  },

});


export const Blog = mongoose.model("Blog",blogSchema)