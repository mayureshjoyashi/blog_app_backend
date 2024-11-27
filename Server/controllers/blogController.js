import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import cloudinary from "cloudinary";
import ErrorHandler from "../middlewares/error.js";
import { Blog } from "../models/blogSchema.js";

export const blogPost = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Blog Main Images Is Mandotory!", 400));
  }

  const {
    mainImage,
    paragraphOneIamge,
    paragraphTwoIamge,
    paragraphThreeIamge,
  } = req.files;

  if (!mainImage) {
    return next(new ErrorHandler("Blog Main Images Is Mandotory!", 400));
    const allowedFormats = ["image/jpg", "image/jpeg", "image/webp"];
    if (
      !allowedFormats.includes(mainImage.mimetype) ||
      (paragraphOneIamge &&
        !allowedFormats.includes(paragraphOneIamge.mimetype)) ||
      (paragraphTwoIamge &&
        !allowedFormats.includes(paragraphTwoIamge.mimetype)) ||
      (paragraphThreeIamge &&
        !allowedFormats.includes(paragraphThreeIamge.mimetype))
    ) {
      return next(
        ErrorHandler(
          "Inavlid File Type, Only JPG ,PNG,WEBP Formats are Allowed",
          400
        )
      );
    }
  }
  const {
    title,
    intro,
    paragraphOneTitle,
    paragraphOnedesc,
    paragraphTwodesc,
    paragraphTwoTitle,
    paragraphThreedesc,
    paragraphThreeTitle,
    category,
  } = req.body;

  const createdBy = req.user_id;
  const authorName = req.user.name;
  const authorAvatar = req.user.avatar.url;

  if (title || !category || !intro) {
    return new ErrorHandler("Title,Intro and Category Are Required Feilds");
  }

  const uploadPromises = [
    cloudinary.uploader.upload(mainImage.tempFilePath),
    paragraphOneIamge
      ? cloudinary.uploader.upload(paragraphOneIamge.tempFilePath)
      : Promise.resolve(null),
    paragraphTwoIamge
      ? cloudinary.uploader.upload(paragraphTwoIamge.tempFilePath)
      : Promise.resolve(null),
    paragraphThreeIamge
      ? cloudinary.uploader.upload(paragraphThreeIamge.tempFilePath)
      : Promise.resolve(null),
  ];

  const [
    mainImageRes,
    paragraphOneIamgeRes,
    paragraphTwoIamgeRes,
    paragraphThreeIamgeRes,
  ] = await Promise.all(uploadPromises);

  if (
    !mainImageRes ||
    mainImageRes.error ||
    (paragraphOneIamge &&
      (!paragraphOneIamgeRes || paragraphOneIamgeRes.error)) ||
    (paragraphTwoIamge &&
      (!paragraphTwoIamgeRes || paragraphTwoIamgeRes.error)) ||
    (paragraphThreeIamge &&
      (!paragraphThreeIamgeRes || paragraphThreeIamgeRes.error))
  ) {
    return next(new ErrorHandler("Error Occured While Uploading One or More Images",500))
  }
  const blogData = {
    title,
    intro,
    paragraphOneTitle,
    paragraphOnedesc,
    paragraphTwodesc,
    paragraphTwoTitle,
    paragraphThreedesc,
    paragraphThreeTitle,
    category,
    createdBy,
    authorName,
    authorAvatar,
    mainImage:{
        public_id:mainImageRes.public_id,
        url:mainImageRes.secure_url,
    }
  }
  if (paragraphOneIamgeRes) {
    blogData.paragraphOneIamge ={
        public_id:paragraphOneIamgeRes.public_id,
        url: paragraphOneIamgeRes.secure_url,
    }
  }
  if (paragraphTwoIamgeRes) {
    blogData.paragraphTwoIamge ={
        public_id:paragraphTwoIamgeRes.public_id,
        url: paragraphTwoIamgeRes.secure_url,
    }
  }
  if (paragraphThreeIamgeRes) {
    blogData.paragraphThreeIamge ={
        public_id:paragraphThreeIamgeRes.public_id,
        url: paragraphThreeIamgeRes.secure_url,
    }
  }
  const blog = await Blog.create(blogData);
  res.status(200).json({
    success:true,
    message:"Blog Created Upload",
    blog
  })
});



export const deleteBlog = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    return next(new ErrorHandler("Blog not found!", 404));
  }
  await blog.deleteOne();
  res.status(200).json({
    success: true,
    message: "Blog deleted!",
  });
});

export const getAllBlogs = catchAsyncErrors(async (req, res, next) => {
  const allBlogs = await Blog.find({ published: true });
  res.status(200).json({
    success: true,
    allBlogs,
  });
});

export const getSingleBlog = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    return next(new ErrorHandler("Blog not found!", 404));
  }
  res.status(200).json({
    success: true,
    blog,
  });
});

export const getMyBlogs = catchAsyncErrors(async (req, res, next) => {
  const createdBy = req.user._id;
  const blogs = await Blog.find({ createdBy });
  res.status(200).json({
    success: true,
    blogs,
  });
});

export const updateBlog = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let blog = await Blog.findById(id);
  if (!blog) {
    return next(new ErrorHandler("Blog not found!", 404));
  }
  const newBlogData = {
    title: req.body.title,
    intro: req.body.intro,
    category: req.body.category,
    paragraphOneTitle: req.body.paragraphOneTitle,
    paragraphOnedesc: req.body.paragraphOnedesc,
    paragraphTwoTitle: req.body.paragraphTwoTitle,
    paragraphTwodesc: req.body.paragraphTwodesc,
    paragraphThreeTitle: req.body.paragraphThreeTitle,
    paragraphThreedesc: req.body.paragraphThreedesc,
    published: req.body.published,
  };
  if (req.files) {
    const { mainImage, paragraphOneIamge, paragraphTwoIamge, paragraphThreeIamge } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (
      (mainImage && !allowedFormats.includes(mainImage.mimetype)) ||
      (paragraphOneIamge && !allowedFormats.includes(paragraphOneIamge.mimetype)) ||
      (paragraphTwoIamge && !allowedFormats.includes(paragraphTwoIamge.mimetype)) ||
      (paragraphThreeIamge && !allowedFormats.includes(paragraphThreeIamge.mimetype))
    ) {
      return next(
        new ErrorHandler(
          "Invalid file format. Only PNG, JPG and WEBp formats are allowed.",
          400
        )
      );
    }
    if (req.files && mainImage) {
      const blogMainImageId = blog.mainImage.public_id;
      await cloudinary.uploader.destroy(blogMainImageId);
      const newBlogMainImage = await cloudinary.uploader.upload(
        mainImage.tempFilePath
      );
      newBlogData.mainImage = {
        public_id: newBlogMainImage.public_id,
        url: newBlogMainImage.secure_url,
      };
    }

    if (req.files && paragraphOneIamge) {
      if (blog.paragraphOneIamge && blog.paragraphOneIamge.public_id) {
        const blogparagraphOneIamgeId = blog.paragraphOneIamge.public_id;
        await cloudinary.uploader.destroy(blogparagraphOneIamgeId);
      }
      const newBlogparagraphOneIamge = await cloudinary.uploader.upload(
        paragraphOneIamge.tempFilePath
      );
      newBlogData.paragraphOneIamge = {
        public_id: newBlogparagraphOneIamge.public_id,
        url: newBlogparagraphOneIamge.secure_url,
      };
    }
    if (req.files && paragraphTwoIamge) {
      if (blog.paragraphTwoIamge && blog.paragraphTwoIamge.public_id) {
        const blogparagraphTwoIamgeId = blog.paragraphTwoIamge.public_id;
        await cloudinary.uploader.destroy(blogparagraphTwoIamgeId);
      }
      const newBlogparagraphTwoIamge = await cloudinary.uploader.upload(
        paragraphTwoIamge.tempFilePath
      );
      newBlogData.paragraphTwoIamge = {
        public_id: newBlogparagraphTwoIamge.public_id,
        url: newBlogparagraphTwoIamge.secure_url,
      };
    }
    if (req.files && paragraphThreeIamge) {
      if (blog.paragraphThreeIamge && blog.paragraphThreeIamge.public_id) {
        const blogparagraphThreeIamgeId = blog.paragraphThreeIamge.public_id;
        await cloudinary.uploader.destroy(blogparagraphThreeIamgeId);
      }
      const newBlogparagraphThreeIamge = await cloudinary.uploader.upload(
        paragraphThreeIamge.tempFilePath
      );
      newBlogData.paragraphThreeIamge = {
        public_id: newBlogparagraphThreeIamge.public_id,
        url: newBlogparagraphThreeIamge.secure_url,
      };
    }
  }
  blog = await Blog.findByIdAndUpdate(id, newBlogData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Blog Updated!",
    blog,
  });
});


