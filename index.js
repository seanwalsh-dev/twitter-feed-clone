import { tweetsData } from "./data.js";
import {v4 as uuidv4} from 'http://jspm.dev/uuid'

const tweetInput = document.getElementById('tweet-input')

const getStoredTweetsData = JSON.parse(localStorage.getItem('storedTweetsData'))

if (getStoredTweetsData){
  tweetsData.length = 0
  // Array.prototype.push.apply(tweetsData, storedTweetsData)
  tweetsData.push(...getStoredTweetsData)
}

document.addEventListener('click', function(e){
  if (e.target.dataset.comment){
    handleCommentsClick(e.target.dataset.comment)
  }
  else if (e.target.dataset.like){
    handleLikeClick(e.target.dataset.like)
  }
  else if (e.target.dataset.retweet){
    handleRetweetClick(e.target.dataset.retweet)
  }
  else if (e.target.id === 'tweet-btn'){
    handleTweetBtnClick()
  }
  else if (e.target.dataset.replyBtn){
    handleReplyBtnClick(e.target.dataset.replyBtn)
  }
  else if (e.target.dataset.tweetTrashCan){
    handleDeleteTweetClick(e.target.dataset.tweetTrashCan)
    console.log(e.target.dataset.tweetTrashCan)
  }
  else if(e.target.dataset.replyTrashCan){
    handleDeleteReplyClick(e.target.dataset.replyTrashCan)
  }
})

function handleLikeClick(tweetId){
  const targetTweet = tweetsData.filter(function(tweet){
    return tweet.uuid === tweetId
    
})[0]

  if (!targetTweet.isLiked){
    targetTweet.likes++
  }
  else if (targetTweet.isLiked){
    targetTweet.likes--
  }
  targetTweet.isLiked = !targetTweet.isLiked
  localStorage.setItem('storedTweetsData', JSON.stringify(tweetsData))
  render()
}

function handleRetweetClick(tweetId){
    const targetTweet = tweetsData.filter(function(tweet){
    return tweet.uuid === tweetId
    
})[0]
  
  if (!targetTweet.isRetweeted){
    targetTweet.retweets++
    targetTweet.isRetweeted = true
    

  }
  else if (targetTweet.isRetweeted){
    targetTweet.retweets--
    targetTweet.isRetweeted = false
  }
  localStorage.setItem('storedTweetsData', JSON.stringify(tweetsData))
  render()
}

function handleCommentsClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
  if(tweetInput.value !== ''){
    tweetsData.unshift({
        handle: `@scrimba`,
        profilePic: `images/scrimbalogo.png`,
        likes: 0,
        retweets: 0,
        tweetText: tweetInput.value,
        replies: [],
        isLiked: false,
        isRetweeted: false,
        uuid: uuidv4(),
    }, )

    tweetInput.value = ''
    localStorage.setItem('storedTweetsData', JSON.stringify(tweetsData))
    render()
  }
}

function handleReplyBtnClick(tweetId){

  const replyInput = document.getElementById(`reply-input-${tweetId}`)
  
  const targetTweet = tweetsData.filter(function(tweet){
    return tweet.uuid === tweetId
  })[0]

  if(replyInput.value){
    targetTweet.replies.push({
        handle: `@scrimba`, 
        profilePic: `images/scrimbalogo.png`,
        likes: 0,
        retweets: 0,
        tweetText: replyInput.value,
        uuid: uuidv4(),
    }, )

    tweetInput.value = ''
    localStorage.setItem('storedTweetsData', JSON.stringify(tweetsData))
    render()
    document.getElementById(`replies-${tweetId}`).classList.remove('hidden')
  }
}

function handleDeleteTweetClick(tweetId){
  
  const index = tweetsData.findIndex(function(tweet){
    return tweet.uuid === tweetId
  })

  if (index !== -1){
    tweetsData.splice(index, 1)
  }
  localStorage.setItem('storedTweetsData', JSON.stringify(tweetsData))
  render()

  // console.log(index)
}

//  Delete Replies   ***WORKING HERE***

function handleDeleteReplyClick(replyId){

  let parentTweetId = null

  tweetsData.forEach(function(tweet){
    const replyIndex = tweet.replies.findIndex(function(reply){
      return reply.uuid === replyId
    })
    if (replyIndex !== -1){
      tweet.replies.splice(replyIndex, 1)
      parentTweetId = tweet.uuid
    }
  })

  localStorage.setItem('storedTweetsData', JSON.stringify(tweetsData))
  render()
  document.getElementById(`replies-${parentTweetId}`).classList.remove('hidden')
}

function getFeedHtml(){

  let feedHtml = ``

  tweetsData.forEach(function(tweet){

    let commented = ''

    let liked = ''

    if (tweet.isLiked){
      liked = 'liked'
    }

    let retweeted = ''

    if (tweet.isRetweeted){
      retweeted = 'retweeted'
    }

    let replyTrashCan = ''
    let tweetTrashCan = ''

    if (tweet.handle.includes(`@scrimba`)){
      tweetTrashCan = `<i class="fa-solid fa-trash hover-red" data-tweet-trash-can="${tweet.uuid}"></i>`

    }

    let replyHtml = ``

    if(tweet.replies.length > 0){

      tweet.replies.forEach(function(reply){
        
        if (reply.handle.includes(`@scrimba`)){
          console.log('you left a comment')
          commented = 'commented'

   // ***WORKING HERE***

          replyTrashCan = `
          <i 
            class="fa-solid fa-trash  hover-red" 
            data-reply-trash-can="${reply.uuid}"></i>`
        }
// Bug: trach can CSS needs work: better placement
        replyHtml += `
          <div class="tweet-reply">
              <div class="tweet-inner">
                  <img src="${reply.profilePic}" class="profile-pic">
                      <div>
                          <p class="handle">${reply.handle}</p>
                          <p class="tweet-text">${reply.tweetText}</p>
                      </div>
                  
              </div>
              <div class="tweet-details">
                    <span class="tweet-detail reply-delete">
                        ${replyTrashCan}
                    </span>
                  </div>
          </div>
        `
      })
    }

    feedHtml += `
      <div class="tweet">
        <div class="tweet-inner">
            <img src="${tweet.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${tweet.handle}</p>
                <p class="tweet-text">${tweet.tweetText}</p>
                <div class="tweet-details">
                    <span class="tweet-detail">
                        <i 
                            class="fa-solid fa-comment ${commented}" 
                            data-comment="${tweet.uuid}">
                        </i>
                        ${tweet.replies.length}
                    </span>
                    <span class="tweet-detail">
                        <i 
                            class="fa-solid fa-heart ${liked}" 
                            data-like="${tweet.uuid}"></i>
                        ${tweet.likes}
                    </span>
                    <span class="tweet-detail">
                        <i 
                            class="fa-solid fa-retweet ${retweeted}" 
                            data-retweet="${tweet.uuid}"></i>
                        ${tweet.retweets}
                    </span>
                    <span class="tweet-detail">
                        ${tweetTrashCan}
                    </span>
                </div>   
            </div>            
        </div>

        <div class="hidden" id="replies-${tweet.uuid}">
            ${replyHtml}
            <div class="tweet-input-area">
                <img src="images/scrimbalogo.png" class="profile-pic">
                <textarea 
                    data-repy-input="${tweet.uuid}"
                    id="reply-input-${tweet.uuid}"></textarea>
            </div>
            <button data-reply-btn="${tweet.uuid}">Reply</button>
        </div>

      </div>

    `

    document.getElementById('feed').innerHTML += feedHtml
    // document.getElementById('feed').innerHTML += replyHtml
  })
  return feedHtml
}

function render(){
  document.getElementById('feed').innerHTML = getFeedHtml()
  
}
render()



