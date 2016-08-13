import Post from '../models/post_model';

export const createPost = (req, res) => {
  const post = new Post();

  post.title = req.body.title;
  post.content = req.body.content;
  post.tags = req.body.tags;
  post.author = req.user.username;

  post.save()
  .then(result => {
    res.json({ message: `Post ${req.params.id} created!` });
  })
  .catch(error => {
    res.json({ error });
  });
};

export const getPosts = (req, res) => {
  Post.find()
  .then(result => {
    const cleanPosts = (posts) => {
      return posts.map(post => {
        return { id: post._id, title: post.title, tags: post.tags, author: post.author };
      });
    };
    res.json(cleanPosts(result));
  })
  .catch(error => {
    res.json({ error });
  });
};

export const getPost = (req, res) => {
  Post.findById(req.params.id)
  .then(result => {
    res.json(result);
  })
  .catch(error => {
    res.json({ error });
  });
};

export const deletePost = (req, res) => {
  Post.findById(req.params.id)
  .then(result => {
    if (req.user.username === result.author) result.remove();
    res.json(result);
  })
  .catch(error => {
    res.json({ error });
  });
};

export const updatePost = (req, res) => {
  Post.findById(req.params.id)
  .then(result => {
    if (req.user.username === result.author) {
      if (req.body.tags) {
        result.tags = req.body.tags;
      }
      if (req.body.content) {
        result.content = req.body.content;
      }
      if (req.body.title) {
        result.title = req.body.title;
      }
      result.save();
    }
  });
  res.json({ message: `Updated post ${req.params.id}!` });
};
