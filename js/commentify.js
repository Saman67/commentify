/**
 * jQuery Commentify Plugin
 *
 * Copyright (c) 2012 Saman Missaghian
 * Licensed under MIT license.
 *
 * Version: 1.0.0
 */
(function($) {
    'use strict';

    $.fn.commentify = function(options){

        /************************************ Options *******************************************/

        var opts = $.extend(true, {}, {
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
        }, options);

        var pageIndex = 0,
            timeIntervalId = 0,
            timeList,
            isLoading = false;

        /********************************** Create tags *****************************************/

        if(opts.autoCreateTags) {
            this.html(
                "<div class='" + opts.classes.form + "'>" +
                    "<input id='" + opts.ids.name + "' type='text' class='" + opts.classes.name + "' placeholder='" + opts.texts.name + "' />" +
                    "<input id='" + opts.ids.email + "' type='email' class='" + opts.classes.email + "' placeholder='" + opts.texts.email + "' />" +
                    "<textarea id='" + opts.ids.comment + "' class='" + opts.classes.comment + "' placeholder='" + opts.texts.comment + "'></textarea>" +
                    "<button id='" + opts.ids.button + "' class='" + opts.classes.button + "'>" + opts.texts.button + "</button>" +
                    "<span id='" + opts.ids.message + "'></span>" +
                "</div>" +
                "<div id='" + opts.ids.commentsContainer + "' class='" + opts.classes.commentsContainer + "'> </div>" +
                "<div id='" + opts.ids.loadMore + "' class='" + opts.classes.loadMore + "'>" +
                    "<span>" + opts.texts.loadMore + "</span>" +
                "</div>");
        }

        var name = $('#' + opts.ids.name, this),
            email = $('#' + opts.ids.email, this),
            comment = $('#' + opts.ids.comment, this),
            message = $('#' + opts.ids.message, this),
            commentsContainer = $('#' + opts.ids.commentsContainer, this);



        /************************************ Set Events ****************************************/

        // Set comment button event
        $('#' + opts.ids.button, this).on('click', function() {
            opts.events.onNewComment();
            addComment();
        });

        // Set load more button event
        $('#' + opts.ids.loadMore, this).on('click', function(){
            loadMore();
        });

        if(opts.infiniteLoad) {
            $(window).scroll(function () {
                if(!isLoading && isElementVisible('#' + opts.ids.loadMore))
                    loadMore();
            });
        }

        /************************************ Methods *******************************************/

        // Load one page of comments from server
        var loadMore = function() {
            isLoading = true;
            opts.events.onLoadComment();
            var from = pageIndex * opts.pageCount;

            $.get(opts.api.get.url + '?count=' + opts.pageCount + '&from=' + from, function (data) {
                data = $.parseJSON(data);
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    html += getCommentTag(data[i]);
                }
                commentsContainer.append(html);
                pageIndex++;
                if(data.length < opts.pageCount)
                    $('#' + opts.ids.loadMore).hide();

                if(opts.liveTiming)
                    setLiveTiming();
            }).always(function() {
                isLoading = false;
            });
        };

        // Save comment in server then display it
        var addComment = function() {
            var data = {name: name.val(), email: email.val(), comment: comment.val() };
            $.ajax({
                url: opts.api.add.url,
                method: opts.api.add.method,
                data: data,
                dataType: opts.api.add.dataType
            }).success(function(result) {
                if(result.status == 'success') {
                    opts.events.onNewCommentSuccess(result);
                    name.val('');
                    email.val('');
                    comment.val('');
                    message.text(opts.texts.success);
                    data.submitdate = new Date().toUTCString();
                    commentsContainer.prepend(getCommentTag(data));
                    setLiveTiming();
                }
                else{
                    opts.events.onNewCommentError(data);
                    message.text(opts.texts.error);
                }
            }).error(function(data){
                opts.events.onNewCommentError(data);
                message.text(opts.texts.error);
            });
        }

        // Generate html for comment fields
        var getCommentTag = function (comment) {
            return "<div class='" + opts.classes.commentBox + "'>" +
            "<span class='" + opts.classes.name + "'>" + comment.name + "</span>" +
            "<span class='" + opts.classes.date + "'><span>" + formatDate(comment.submitdate) + "</span><input type='hidden' value='" +
                comment.submitdate + "'/></span>" +
            "<p class='" + opts.classes.comment + "'>" + comment.comment + "</p>" +
            "</div>";
        }

        // Format to human readable time
        var formatDate = function(date) {
            //date = (date || "").replace(/-/g, "/").replace(/[TZ]/g, " ");
            var newDate = new Date(date),
                diff = (((new Date()).getTime() - newDate.getTime()) / 1000),
                day_diff = Math.floor(diff / 86400);

            if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31)
                return;

            return day_diff == 0 && (
                diff < 60 && "just now" ||
                diff < 120 && "1 minute ago" ||
                diff < 3600 && Math.floor(diff / 60) + " minutes ago" ||
                diff < 7200 && "1 hour ago" ||
                diff < 86400 && Math.floor(diff / 3600) + " hours ago") ||
                day_diff == 1 && "Yesterday" ||
                day_diff < 7 && day_diff + " days ago" ||
                day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago";
        }

        // Set interval to update comments time
        var setLiveTiming = function() {
            timeList = new Array();
            $('.' + opts.classes.date).each(function() {
                var $tag = $(this);
                var date = $tag.find('input').val();
                timeList.push({ date: date, tag: $tag.find('span') });
            });

            if(timeIntervalId)
                clearInterval(timeIntervalId);

            timeIntervalId = setInterval(function () {
                for(var i=0; i<timeList.length; i++) {
                    timeList[i].tag.text(formatDate(timeList[i].date));
                }
            }, opts.liveTimingInterval);
        }

        var isElementVisible = function(element) {
            var TopView = $(window).scrollTop();
            var BotView = TopView + $(window).height();
            var TopElement = $(element).offset().top;
            var BotElement = TopElement + $(element).height();
            return ((BotElement <= BotView) && (TopElement >= TopView));
        }

        /********************************* Load Comments ****************************************/

        // Load first page of comments
        loadMore();

        return this;
    };

}(jQuery));