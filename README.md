# Commentify
jQuery plugin to provide comment functionality

If you want to integrate restful comment feature for your one page or multi page website, Commentify allows you to easily integrate it with few lines of code.

Note: At this time Commentify does not support user authentication for leaving a comment, but it's in my schedule to add this feature in the future.

If you found a bug or have an idea for new features, please feel free to contact me. I appreciate your contribution to make this plugin better.

### Demo ###

- [Commentify](http://commentify.samanmissaghian.com)


### Basic Usage Example ###

```html
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Commentify jQuery Plugin</title>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/commentify.css" rel="stylesheet">
</head>
<body>
  <div class="container">
    <section class="row">
    
        <!-- Container for comments and form -->
        <div id="commentify" class="commentify col-md-8 col-md-offset-2">
        </div>
        
    </section>
  </div>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
  <script src="js/commentify.js"></script>
  <script type="application/javascript">
    $('#commentify').commentify({
        pageCount: 8,
        infiniteLoad: true,
        liveTiming: true
    });
  </script>
</body>
</html>
```
     
     
     
### List of all available options

```js

$('#commentify').commentify({
        autoCreateTags: true,
        infiniteLoad: false,
        liveTiming: false,
        liveTimingInterval : 30000,
        pageCount: 10,
        api: {
            add: {
                url: '/api/add-comment',
                method: 'post',
                dataType: 'json'
            },
            get: {
                url: '/api/get-comments',
                method: 'get'
            }
        },
        fields: {
            name: true,
            email: true,
            comment: true
        },
        ids: {
            name: 'commentify-name',
            email: 'commentify-email',
            comment: 'commentify-comment',
            button: 'commentify-button',
            message: 'commentify-message',
            loadMore: 'commentify-load-more',
            commentsContainer: 'commentify-comments'
        },
        classes: {
            name: 'commentify-name',
            email: 'commentify-email',
            comment: 'commentify-comment',
            date: 'commentify-date',
            button: 'commentify-button',
            form: 'commentify-form',
            loadMore: 'commentify-load-more',
            commentsContainer: 'comments-container',
            commentBox: 'commentify-comment-box'
        },
        texts: {
            name: 'Full Name',
            email: 'Email address',
            comment: 'Enter your comment here',
            button: 'Comment',
            loadMore: 'Load more comments',
            success: 'Thank you for your comment!',
            error: 'OOPS, Something is wrong! Please try again latter'
        },
        events: {
            onNewComment: $.noop,
            onNewCommentSuccess: $.noop,
            onNewCommentError: $.noop,
            onLoadComment: $.noop
        }
    });

```


### Changelog ###

**1.0.0**
*  Fields: name, email, comment, date
*  Infinite load
*  Refresh comment time



### License ###

This content is released under the MIT License (http://opensource.org/licenses/MIT).
